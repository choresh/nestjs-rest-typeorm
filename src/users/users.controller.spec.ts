import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { join } from 'path';

describe('UsersController', () => {
  let app: INestApplication;
  let repository: Repository<User>;

  beforeAll(async () => {
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
      controllers: [UsersController],
      providers: [UsersService],
    }).compile();

    app = module.createNestApplication();
    await app.init();

    repository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  afterEach(async () => {
    await repository.query(`DELETE FROM user`);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('createOne', () => {
    it('should create a user when passed valid input', async () => {
      const createUserDto: CreateUserDto = {
        firstName: 'John',
        lastName: 'Doe',
      };

      const response = await request(app.getHttpServer())
        .post('/users')
        .send(createUserDto)
        .expect(201);

      expect(response.body.id).toBeDefined();
      expect(response.body.firstName).toBe(createUserDto.firstName);
    });

    it('should throw an error if the input is invalid', async () => {
      const createUserDto: CreateUserDto = {
        firstName: undefined,
        lastName: '',
      };

      const response = await request(app.getHttpServer())
        .post('/users')
        .send(createUserDto)
        .expect(500);

      expect(response.body.message).toBe('Internal server error');
    });
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      const createUserDto: CreateUserDto = {
        firstName: 'John',
        lastName: 'Doe',
      };
      await repository.save(createUserDto);

      const response = await request(app.getHttpServer())
        .get('/users')
        .expect(200);

      expect(response.body).toBeInstanceOf(Array);
      expect(response.body).toHaveLength(1);
    });

    it('should return an empty array if no users are found', async () => {
      const response = await request(app.getHttpServer())
        .get('/users')
        .expect(200);

      expect(response.body).toBeInstanceOf(Array);
      expect(response.body).toHaveLength(0);
    });
  });

  describe('findSome', () => {
    it('should return some users', async () => {
      const filePath = join(
        __dirname,
        '..',
        '..',
        'test',
        'data',
        'users.json',
      );
      await request(app.getHttpServer())
        .post('/users/import')
        .attach('file', filePath)
        .expect(201);

      const response = await request(app.getHttpServer())
        .get('/users/some?firstName=f2&isActive=true')
        .expect(200);

      expect(response.body).toBeInstanceOf(Array);
      expect(response.body).toHaveLength(1);
      expect(response.body[0].firstName).toBe('f2');
    });

    it('should return an empty array if no users are found', async () => {
      const filePath = join(
        __dirname,
        '..',
        '..',
        'test',
        'data',
        'users.json',
      );
      await request(app.getHttpServer())
        .post('/users/import')
        .attach('file', filePath)
        .expect(201);

      const response = await request(app.getHttpServer())
        .get('/users/some?firstName=f2&isActive=false')
        .expect(200);

      expect(response.body).toBeInstanceOf(Array);
      expect(response.body).toHaveLength(0);
    });
  });

  describe('findOneById', () => {
    it('should return a user when passed a valid ID', async () => {
      const createUserDto: CreateUserDto = {
        firstName: 'John',
        lastName: 'Doe',
      };
      const user = await repository.save(createUserDto);

      const response = await request(app.getHttpServer())
        .get(`/users/${user.id}`)
        .expect(200);

      expect(response.body.id).toBe(user.id);
    });

    it('should not throw an error if the user is not found', async () => {
      const response = await request(app.getHttpServer())
        .get('/users/999')
        .expect(200);

      expect(response.body).toEqual({});
    });
  });

  describe('updateOneById', () => {
    it('should update a user when passed a valid ID and valid input', async () => {
      const createUserDto: CreateUserDto = {
        firstName: 'John',
        lastName: 'Doe',
      };
      const user = await repository.save(createUserDto);
      const updateUserDto: UpdateUserDto = { firstName: 'Jane' };

      const response = await request(app.getHttpServer())
        .patch(`/users/${user.id}`)
        .send(updateUserDto)
        .expect(200);

      expect(response.body.affected).toBe(1);

      const updatedUser = await repository.findOneBy({ id: user.id });
      expect(updatedUser.firstName).toBe(updateUserDto.firstName);
    });

    it('should not throw an error if the user is not found', async () => {
      const updateUserDto: UpdateUserDto = { firstName: 'Jane' };

      const response = await request(app.getHttpServer())
        .patch('/users/999')
        .send(updateUserDto)
        .expect(200);

      expect(response.body.affected).toBe(0);
    });
  });

  describe('removeOneById', () => {
    it('should remove a user when passed a valid ID', async () => {
      const createUserDto: CreateUserDto = {
        firstName: 'John',
        lastName: 'Doe',
      };

      const user = await repository.save(createUserDto);

      const response = await request(app.getHttpServer())
        .delete(`/users/${user.id}`)
        .expect(200);

      expect(response.body.affected).toBe(1);

      const removedUser = await repository.findOneBy({ id: user.id });
      expect(removedUser).toBeNull();
    });

    it('should not throw an error if the user is not found', async () => {
      const response = await request(app.getHttpServer())
        .delete('/users/999')
        .expect(200);

      expect(response.body.affected).toBe(0);
    });
  });

  describe('import', () => {
    it('should import users from external file', async () => {
      const filePath = join(
        __dirname,
        '..',
        '..',
        'test',
        'data',
        'users.json',
      );
      await request(app.getHttpServer())
        .post('/users/import')
        .attach('file', filePath)
        .expect(201);
    });
  });

  describe('export', () => {
    it('should export all users to external file', async () => {
      const filePath = join(
        __dirname,
        '..',
        '..',
        'test',
        'data',
        'users.json',
      );
      await request(app.getHttpServer())
        .post('/users/import')
        .attach('file', filePath)
        .expect(201);

      const response = await request(app.getHttpServer())
        .get('/users/export')
        .expect(200);
      expect(response.body[1].firstName).toBe('f2');
      expect(response.headers['content-disposition']).toBe(
        'attachment; filename="users.json"',
      );
    });
  });
});
