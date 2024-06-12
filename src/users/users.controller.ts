import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  Header,
  StreamableFile,
  Query,
} from '@nestjs/common';
import { UsersFilter, UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { User } from './entities/user.entity';
import { DeleteResult, UpdateResult } from 'typeorm';
import { Readable } from 'stream';

function strToBoolean(str: string): boolean {
  if (str === 'true') {
    return true;
  }
  if (str === 'false') {
    return false;
  }
  throw new Error(`Invalid value ('${str}' is not 'true' or 'false')`);
}

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async createOne(@Body() createUserDto: CreateUserDto): Promise<User> {
    return await this.usersService.createOne(createUserDto);
  }

  @Get()
  async findAll(): Promise<User[]> {
    return await this.usersService.findAll();
  }

  @Get('some')
  async findSome(
    @Query('firstName') firstName: string,
    @Query('lastName') lastName: string,
    @Query('isActive') isActive: string,
  ): Promise<User[]> {
    const filter: UsersFilter = {
      firstName,
      lastName,
      isActive: strToBoolean(isActive),
    };
    return await this.usersService.findSome(filter);
  }

  @Get('export')
  @Header('Content-Type', 'application/json')
  @Header('Content-Disposition', 'attachment; filename="users.json"')
  async exportAllUsers(): Promise<StreamableFile> {
    const data = await this.usersService.findAll();
    const dataStream = new Readable();
    dataStream.push(JSON.stringify(data));
    dataStream.push(null); // End the stream
    return new StreamableFile(dataStream);
  }

  @Get(':id')
  async findOneById(@Param('id') id: string): Promise<User | null> {
    return await this.usersService.findOneById(Number(id));
  }

  @Patch(':id')
  async updateOneById(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UpdateResult> {
    return await this.usersService.updateOneById(Number(id), updateUserDto);
  }

  @Delete(':id')
  async removeOneById(@Param('id') id: string): Promise<DeleteResult> {
    return await this.usersService.removeOneById(Number(id));
  }

  @Post('import')
  @UseInterceptors(FileInterceptor('file'))
  async importManyUsers(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<User[]> {
    const createUserDtos: CreateUserDto[] = JSON.parse(file.buffer?.toString());
    return await this.usersService.createMany(createUserDtos);
  }
}
