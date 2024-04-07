import { ConflictException, Injectable } from '@nestjs/common';
import { CreateRegisterDto, CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schema/user.schema';
import {genSaltSync,hashSync,compareSync} from 'bcryptjs';
import { SALT } from 'src/const/const';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IUser } from './interface/user.interface';
import mongoose from 'mongoose';
import aqp from 'api-query-params';
import { isEmpty } from 'class-validator';
@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel:SoftDeleteModel<UserDocument>){}
  async create(createUserDto: CreateUserDto,user:IUser) {
    const {name,email,password,age,gender,address,role,company}=createUserDto;
    const isExistEmail=await this.findByEmail(email);
    const hashPassword=this.hashPassword(password);
    let newUser=await this.userModel.create({
      name,email,password:hashPassword,
      gender,address,age,company,
      role,createdBy:{
        _id:user?._id,
        email:user?.email
      }
    });
    return newUser;
  }

  async findAll(currentPage:number,pageSize:number,qs:string) {
    const { filter, sort, projection, population } = aqp(qs);
    delete filter.page;
    delete filter.limit;
    let offset=(+currentPage-1)*(+pageSize);
    let defaultLimit=(+pageSize) ? +pageSize : 10;
    const totalItems=(await this.userModel.find(filter)).length;
    const totalPages=Math.ceil(totalItems/defaultLimit);
    if (isEmpty(sort)) {
      // @ts-ignore: Unreachable code error
      sort = "-updatedAt"
    }
    const result = await this.userModel.find(filter)
       .skip(offset)
       .limit(defaultLimit)
       // @ts-ignore: Unreachable code error
       .sort(sort)
       .populate(population)
       .exec();
    return {
        meta: {
        current: currentPage, //trang hiện tại
        pageSize: pageSize, //số lượng bản ghi đã lấy
        pages: totalPages, //tổng số trang với điều kiện query
        total: totalItems // tổng số phần tử (số bản ghi)
        },
        result //kết quả query
      }
  }

  async findOne(id: string) {
  
    return await this.userModel.findOne({_id:id}).select('-password');
   
  }

  async update(updateUserDto: UpdateUserDto,user:IUser) {
      const updated=await this.userModel.updateOne({
        _id:updateUserDto._id
      },
    {
      ...updateUserDto,
      updatedBy:{
        _id:user?._id,
        email:user?.email
      }
    });
    return updated;
  }

  async remove(id: string,user:IUser) {
    //  if(!mongoose.Types.ObjectId.isValid(id)){
    //     throw new NotAcceptableException('Not Found')
    //  };
     await this.userModel.updateOne({_id:id},{deletedBy:{_id:user?._id,email:user?.email}})
     return await this.userModel.softDelete({_id:id})
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
     return await this.userModel.findOne({email}).lean();
  }
  async register(user:CreateRegisterDto){
     const {name,email,password,age,gender,address}=user;
     const isEmailExist=await this.findByEmail(email);
     if(isEmailExist){
        throw new ConflictException('Email đã tồn tại. Vui lòng đăng kí tài khoản khác!')
     }
     let passwordNew=this.hashPassword(password);
     let newUserRegister=await this.userModel.create({
        name,email,password:passwordNew,age,gender,address
     });
     return newUserRegister;
  }

}
