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
    return this.usersRepository.find();
  }

  async findSome(where: FindOptionsWhere<User>): Promise<User[]> {
    return this.usersRepository.find({
      where,
    });
  }

  findOneById(id: number): Promise<User | null> {
    return this.usersRepository.findOneBy({ id });
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
