import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schema/user.schema';
import {genSaltSync,hashSync,compareSync} from 'bcryptjs';
import { SALT } from 'src/const/const';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel:SoftDeleteModel<UserDocument>){}
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
  checkPasswordValid(password:string,hash:string){
      return compareSync(password,hash);
  }
  async findByEmail(email:string){
     return await this.userModel.findOne({email});
  }
}
