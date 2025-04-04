// users.service.ts

import { Injectable, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { User } from './schema/user.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const { username, email, password, role } = createUserDto;
    
    // Verificar si ya existe el username o el email
    const existingByUser = await this.userModel.findOne({ username }).exec();
    if (existingByUser) {
      throw new ConflictException(`El usuario '${username}' ya existe`);
    }

    const existingByEmail = await this.userModel.findOne({ email }).exec();
    if (existingByEmail) {
      throw new ConflictException(`El email '${email}' ya está en uso`);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new this.userModel({
      username,
      email,
      password: hashedPassword,
      role,
    });

    return newUser.save();
  }

  // Buscar por username
  async findByUsername(username: string): Promise<User> {
    const user = await this.userModel.findOne({ username }).exec();
    if (!user) {
      throw new ConflictException(`No user found with username '${username}'`);
    }
    return user;
  }

  // Buscar por email
  async findByEmail(email: string): Promise<User> {
    const user = await this.userModel.findOne({ email }).exec();
    if (!user) {
      throw new ConflictException(`No user found with email '${email}'`);
    }
    return user;
  }

  // Buscar por Id
  async findById(userId: string): Promise<User> {
    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      throw new ConflictException(`No user found with ID '${userId}'`);
    }
    return user;
  }
}
