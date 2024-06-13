import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { UsersFilter, UsersService } from './users.service';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

describe('UsersService', () => {
  let service: UsersService;
  let repository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [User],
          synchronize: true,
        }),
        TypeOrmModule.forFeature([User]),
      ],
      providers: [UsersService],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  afterEach(async () => {
    await repository.query(`DELETE FROM user`);
  });

  describe('createOne', () => {
    it('should create and return a user when passed valid input', async () => {
      const createUserDto: CreateUserDto = {
        firstName: 'John',
        lastName: 'Doe',
      };
      const user = await service.createOne(createUserDto);

      expect(user.id).toBeDefined();
      expect(user.firstName).toBe(createUserDto.firstName);
    });

    it('should throw an error if the creation fails', async () => {
      const createUserDto: CreateUserDto = {
        firstName: undefined,
        lastName: '',
      };

      await expect(service.createOne(createUserDto)).rejects.toThrow();
    });
  });

  describe('createMany', () => {
    it('should create and return a user when passed valid input', async () => {
      const createUserDtos: CreateUserDto[] = [
        {
          firstName: 'John',
          lastName: 'Doe',
        },
        {
          firstName: 'John',
          lastName: 'Smit',
        },
      ];
      const users = await service.createMany(createUserDtos);

      expect(users[0].firstName).toBe(createUserDtos[0].firstName);
      expect(users[1].lastName).toBe(createUserDtos[1].lastName);
    });

    it('should throw an error if the creation fails', async () => {
      const createUserDtos: CreateUserDto[] = [
        {
          firstName: 'John',
          lastName: 'Doe',
        },
        {
          firstName: undefined,
          lastName: 'Smit',
        },
      ];

      await expect(service.createMany(createUserDtos)).rejects.toThrow();
    });
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      const createUserDtos: CreateUserDto[] = [
        {
          firstName: 'John',
          lastName: 'Doe',
        },
        {
          firstName: 'John',
          lastName: 'Smit',
        },
      ];
      await service.createMany(createUserDtos);
      const users = await service.findAll();
      expect(users[0].firstName).toBe(createUserDtos[0].firstName);
      expect(users[1].lastName).toBe(createUserDtos[1].lastName);
    });

    it('should return an empty array if no users are found', async () => {
      const users = await service.findAll();
      expect(users).toHaveLength(0);
    });
  });

  describe('findSome', () => {
    it('should return some users', async () => {
      const createUserDtos: CreateUserDto[] = [
        {
          firstName: 'John',
          lastName: 'Doe',
        },
        {
          firstName: 'John',
          lastName: 'Smit',
        },
      ];
      await service.createMany(createUserDtos);

      const filter: UsersFilter = {
        lastName: 'Smit',
      };
      const users = await service.findSome(filter);
      expect(users).toBeInstanceOf(Array);
      expect(users).toHaveLength(1);
      expect(users[0].lastName).toBe(filter.lastName);
    });

    it('should return an empty array if no users are found', async () => {
      const createUserDtos: CreateUserDto[] = [
        {
          firstName: 'John',
          lastName: 'Doe',
        },
        {
          firstName: 'John',
          lastName: 'Smit',
        },
      ];
      await service.createMany(createUserDtos);

      const filter: UsersFilter = {
        isActive: false,
      };
      const users = await service.findSome(filter);
      expect(users).toHaveLength(0);
    });
  });

  describe('findOneById', () => {
    it('should return a user when passed a valid ID', async () => {
      const createUserDto: CreateUserDto = {
        firstName: 'John',
        lastName: 'Doe',
      };
      const user = await service.createOne(createUserDto);
      const foundUser = await service.findOneById(user.id);

      expect(foundUser).not.toBeNull();
      expect(foundUser.id).toBe(user.id);
    });

    it('should not throw an error if the user is not found', async () => {
      const user = await service.findOneById(999);
      expect(user).toBeNull();
    });
  });

  describe('updateOneById', () => {
    it('should update a user when passed a valid ID and valid input', async () => {
      const createUserDto: CreateUserDto = {
        firstName: 'John',
        lastName: 'Doe',
      };
      const user = await service.createOne(createUserDto);
      const updateUserDto: UpdateUserDto = { firstName: 'Jane' };

      const result = await service.updateOneById(user.id, updateUserDto);
      expect(result.affected).toBe(1);

      const updatedUser = await service.findOneById(user.id);
      expect(updatedUser.firstName).toBe(updateUserDto.firstName);
    });

    it('should not throw an error if the user is not found', async () => {
      const updateUserDto: UpdateUserDto = { firstName: 'Jane' };
      const result = await service.updateOneById(999, updateUserDto);

      expect(result.affected).toBe(0);
    });
  });

  describe('removeOneById', () => {
    it('should remove a user when passed a valid ID', async () => {
      const createUserDto: CreateUserDto = {
        firstName: 'John',
        lastName: 'Doe',
      };
      const user = await service.createOne(createUserDto);

      const result = await service.removeOneById(user.id);
      expect(result.affected).toBe(1);

      const removedUser = await service.findOneById(user.id);
      expect(removedUser).toBeNull();
    });

    it('should not throw an error if the user is not found', async () => {
      const result = await service.removeOneById(999);
      expect(result.affected).toBe(0);
    });
  });
});
