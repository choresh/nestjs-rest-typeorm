import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

jest.mock('./users.service');

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [UsersService],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  describe('create', () => {
    it('should create a user when passed valid input', async () => {
      const createUserDto: CreateUserDto = {
        firstName: 'n1',
        lastName: 'n2',
        // isActive: false
      };
      const result = { id: 1, ...createUserDto };

      jest.spyOn(service, 'create').mockResolvedValue(result as never);

      expect(await controller.create(createUserDto)).toBe(result);
    });

    it('should throw an error if the input is invalid', async () => {
      const createUserDto: CreateUserDto = {
        firstName: '',
        lastName: '',
        // isActive: false
      };

      jest
        .spyOn(service, 'create')
        .mockRejectedValue(new Error('Invalid input') as never);

      await expect(controller.create(createUserDto)).rejects.toThrow(
        'Invalid input',
      );
    });
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      const result = [
        { id: 1, firstName: 'n1', lastName: 'n2', isActive: true },
      ];

      jest.spyOn(service, 'findAll').mockResolvedValue(result as never);

      expect(await controller.findAll()).toBe(result);
    });

    it('should return an empty array if no users are found', async () => {
      const result = [];

      jest.spyOn(service, 'findAll').mockResolvedValue(result as never);

      expect(await controller.findAll()).toBe(result);
    });
  });

  describe('findOne', () => {
    it('should return a user when passed a valid ID', async () => {
      const result = { id: 1, firstName: 'n1', lastName: 'n2', isActive: true };

      jest.spyOn(service, 'findOne').mockResolvedValue(result as never);

      expect(await controller.findOne('1')).toBe(result);
    });

    it('should throw an error if the user is not found', async () => {
      jest
        .spyOn(service, 'findOne')
        .mockRejectedValue(new Error('User not found') as never);

      await expect(controller.findOne('1')).rejects.toThrow('User not found');
    });
  });

  describe('update', () => {
    it('should update a user when passed a valid ID and valid input', async () => {
      const updateUserDto: UpdateUserDto = { firstName: 'n2' };
      const result = { id: 1, ...updateUserDto };

      jest.spyOn(service, 'update').mockResolvedValue(result as never);

      expect(await controller.update('1', updateUserDto)).toBe(result);
    });

    it('should throw an error if the user is not found', async () => {
      const updateUserDto: UpdateUserDto = { firstName: 'n2' };

      jest
        .spyOn(service, 'update')
        .mockRejectedValue(new Error('User not found') as never);

      await expect(controller.update('1', updateUserDto)).rejects.toThrow(
        'User not found',
      );
    });

    it('should throw an error if the input is invalid', async () => {
      const updateUserDto: UpdateUserDto = { firstName: '' };

      jest
        .spyOn(service, 'update')
        .mockRejectedValue(new Error('Invalid input') as never);

      await expect(controller.update('1', updateUserDto)).rejects.toThrow(
        'Invalid input',
      );
    });
  });

  describe('remove', () => {
    it('should remove a user when passed a valid ID', async () => {
      const result = { id: 1, firstName: 'n2' };

      jest.spyOn(service, 'remove').mockResolvedValue(result as never);

      expect(await controller.remove('1')).toBe(result);
    });

    it('should throw an error if the user is not found', async () => {
      jest
        .spyOn(service, 'remove')
        .mockRejectedValue(new Error('User not found') as never);

      await expect(controller.remove('1')).rejects.toThrow('User not found');
    });
  });
});
