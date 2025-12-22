import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model, Types } from 'mongoose';
import { RegisterDto } from 'src/auth/dto/registerUser.dto';
import { ERROR_CODES } from 'src/constants/common.constants';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async findById(id: Types.ObjectId) {
    return await this.userModel.findById(id);
  }

  async createUser(registerUserDto: RegisterDto) {
    try {
      const user = await this.userModel.create(registerUserDto);
      return user;
    } catch (error) {
      const e = error as { code?: number };
      if (e.code === ERROR_CODES.DUPLICATE) {
        throw new ConflictException('User already exists');
      }
      throw error;
    }
  }

  async findByEmail(email: string) {
    const user = await this.userModel.findOne({ email });
    return user;
  }
}
