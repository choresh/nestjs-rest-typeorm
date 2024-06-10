/*
import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
*/

import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { UsersService } from './users.service';
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

  describe('create', () => {
    it('should create and return a user when passed valid input', async () => {
      const createUserDto: CreateUserDto = {
        firstName: 'John Doe',
        lastName: '',
      };
      const user = await service.create(createUserDto);

      expect(user).toHaveProperty('id');
      expect(user.firstName).toBe(createUserDto.firstName);
    });

    it('should throw an error if the creation fails', async () => {
      const createUserDto: CreateUserDto = {
        firstName: undefined,
        lastName: '',
      };

      await expect(service.create(createUserDto)).rejects.toThrow();
    });
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      const users = await service.findAll();
      expect(users).toBeInstanceOf(Array);
    });

    it('should return an empty array if no users are found', async () => {
      const users = await service.findAll();
      expect(users).toHaveLength(0);
    });
  });

  describe('findOne', () => {
    it('should return a user when passed a valid ID', async () => {
      const createUserDto: CreateUserDto = {
        firstName: 'John Doe',
        lastName: '',
      };
      const user = await service.create(createUserDto);
      const foundUser = await service.findOne(user.id);

      expect(foundUser).not.toBeNull();
      expect(foundUser).toHaveProperty('id', user.id);
    });

    it('should return null if the user is not found', async () => {
      const user = await service.findOne(999);
      expect(user).toBeNull();
    });
  });

  describe('update', () => {
    it('should update a user when passed a valid ID and valid input', async () => {
      const createUserDto: CreateUserDto = {
        firstName: 'John Doe',
        lastName: '',
      };
      const user = await service.create(createUserDto);
      const updateUserDto: UpdateUserDto = { firstName: 'Jane Doe' };

      const result = await service.update(user.id, updateUserDto);
      expect(result.affected).toBe(1);

      const updatedUser = await service.findOne(user.id);
      expect(updatedUser.firstName).toBe(updateUserDto.firstName);
    });

    it('should return an error if the user is not found', async () => {
      const updateUserDto: UpdateUserDto = { firstName: 'Jane Doe' };
      const result = await service.update(999, updateUserDto);

      expect(result.affected).toBe(0);
    });
  });

  describe('remove', () => {
    it('should remove a user when passed a valid ID', async () => {
      const createUserDto: CreateUserDto = {
        firstName: 'John Doe',
        lastName: '',
      };
      const user = await service.create(createUserDto);

      const result = await service.remove(user.id);
      expect(result.affected).toBe(1);

      const removedUser = await service.findOne(user.id);
      expect(removedUser).toBeNull();
    });

    it('should return an error if the user is not found', async () => {
      const result = await service.remove(999);
      expect(result.affected).toBe(0);
    });
  });
});
