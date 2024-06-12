import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  DeleteResult,
  FindOptionsWhere,
  Repository,
  UpdateResult,
} from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';

export type UsersFilter = FindOptionsWhere<User>;

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async createOne(createUserDto: CreateUserDto): Promise<User> {
    const newEntity = this.usersRepository.create(createUserDto);
    return await this.usersRepository.save(newEntity);
  }

  async findAll(): Promise<User[]> {
    return await this.usersRepository.find();
  }

  async findSome(filter: UsersFilter): Promise<User[]> {
    return await this.usersRepository.find({
      where: filter,
    });
  }

  async findOneById(id: number): Promise<User | null> {
    return await this.usersRepository.findOneBy({ id });
  }

  async updateOneById(
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<UpdateResult> {
    return await this.usersRepository.update({ id }, updateUserDto);
  }

  async removeOneById(id: number): Promise<DeleteResult> {
    return await this.usersRepository.delete(id);
  }

  async createMany(createUserDtos: CreateUserDto[]): Promise<User[]> {
    const newEntities = createUserDtos.map((currCreateUserDto) =>
      this.usersRepository.create(currCreateUserDto),
    );
    return await this.usersRepository.save(newEntities);
  }
}
