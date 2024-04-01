import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schema/user.schema';
import { Model } from 'mongoose';
import {genSaltSync,hashSync} from 'bcryptjs';
import { SALT } from 'src/const/const';
@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel:Model<User>){}
  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
  hashPassword(password:string){
    const salt=genSaltSync(SALT);
    const hash=hashSync(password,salt);
    return hash;
  }
}
