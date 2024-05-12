import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateRegisterDto, CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto, UpdateUserNormal } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schema/user.schema';
import {genSaltSync,hashSync,compareSync} from 'bcryptjs';
import { SALT } from 'src/const/const';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IRole, IUser } from './interface/user.interface';
import mongoose from 'mongoose';
import aqp from 'api-query-params';
import { isEmpty } from 'class-validator';
import { Role, RoleDocument } from 'src/roles/schema/role.schema';
import { USER_ROLE } from 'src/databases/simple';
@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel:SoftDeleteModel<UserDocument>,
    @InjectModel(Role.name) private  roleModel:SoftDeleteModel<RoleDocument>){}
  async create(createUserDto: CreateUserDto,user:IUser) {
    const {name,email,password,age,gender,address,role,company}=createUserDto;
    const isExistEmail=await this.findByEmail(email);
    if(isExistEmail){
       throw new ConflictException('Email đã tồn tại.Vui lòng chon tk khác!')
    }
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
    let { filter, sort, projection, population } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;
    let defaultPageSize=+pageSize ? +pageSize : 10;
    let defaultPage=+currentPage ? +currentPage : 1;
    let offSetPage=(+defaultPage-1)*(+defaultPageSize);
    const totalItems=(await this.userModel.find(filter)).length;
    const totalPages=Math.ceil(totalItems/defaultPageSize);
    //@ts-ignore
    if(isEmpty(sort)){
      //@ts-ignore:
       sort='-updatedAt';
    }
    const result=await this.userModel.find(filter)
    .skip(offSetPage)
    .limit(defaultPageSize)
    //@ts-ignore
    .sort(sort)
    .select('-password')
    .populate(population)
    .exec();
    return {
       meta:{
          page:defaultPage as number,
          pageSize:defaultPageSize as number,
          pages:totalPages as number,
          total:totalItems as number
       },
       result
    }
  }
  async findOne(id: string) {
    if(!mongoose.Types.ObjectId.isValid(id)){
      throw new NotFoundException('Not Found')
   };
    return await this.userModel.findOne({_id:id}).select('-password').populate({path:'role',select:{name:1,_id:1}});
   
  }
  async update(updateUserDto: UpdateUserDto,user:IUser) {
    const {email}=updateUserDto;
    const isExistEmail=await this.findByEmail(email);
    if(isExistEmail){
       throw new ConflictException('Email đã tồn tại.Vui lòng chon tk khác!')
    }
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
     if(!mongoose.Types.ObjectId.isValid(id)){
        throw new NotFoundException('Not Found')
     };
     const foundUser=await this.userModel.findById(id);
     if(foundUser?.email==='admin@gmail.com'){
        throw new BadRequestException('Không được xóa Admin');
     }
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
     return await this.userModel.findOne({email}).populate({path:'role',select:{name:1}})
  }
  async register(user:CreateRegisterDto){
     const {name,email,password,age,gender,address}=user;
     const isEmailExist=await this.findByEmail(email);
     if(isEmailExist){
        throw new ConflictException('Email đã tồn tại. Vui lòng đăng kí tài khoản khác!')
     };
     const userRole=await this.roleModel.findOne({name:USER_ROLE});

     let passwordNew=this.hashPassword(password);
     let newUserRegister=await this.userModel.create({
        name,email,password:passwordNew,age,gender,address,
        role:userRole?._id
     });
     return newUserRegister;
  }
  async updateRefreshToken(refreshToken:string,_id:string){
      return await this.userModel.updateOne({_id},{refreshToken});
  }
  async findUserByToken(refreshToken:string){
    return await this.userModel.findOne({refreshToken});
  }
  async updateUserNormal(user:IUser,updateUserNormal:UpdateUserNormal){
     const userUpdate=await this.userModel.findOne({_id:user?._id});
     console.log('<<<<<<< userssss >>>>>>>',userUpdate);
     const updated= await this.userModel.updateOne({_id:user?._id},{
       ...updateUserNormal,
       updatedBy:{
         _id:user?._id,
         email:user?.email
       }
     })
     return updated;
  }
  async upsertUserSocial(type,dataRaw){
       try {
         let user=null;
         if(type==='GOOGLE'){
            const userRole=await this.roleModel.findOne({name:USER_ROLE});
             user=await this.userModel.findOne({typeAcc:type,email:dataRaw.email});
             if(!user){
                 const newUser=await this.userModel.create({
                  email:dataRaw.email,
                  name:dataRaw.username,
                  typeAcc:type,
                  role:userRole?._id
                })
                user=newUser;
             }
         };
         if(type==='FACEBOOK'){
          const userRole=await this.roleModel.findOne({name:USER_ROLE});
             user=await this.userModel.findOne({typeAcc:type,email:dataRaw.email});
             if(!user){
                const newUser= await this.userModel.create({
                  email:dataRaw.email,
                  name:dataRaw.username,
                  typeAcc:type,
                  role:userRole?._id
                })
                user=newUser;
             }
         };
         console.log('usser112',user);
         return user;
       } catch (error) {
         console.log(error);
       }
  }
  async findUserLoginGoogle(id: string) {
    const user = await this.findOne(id);
    console.log('user1', user);
    if (!user || !user.role) {
        // Xử lý khi không tìm thấy user hoặc user không có role
        return null;
    }
    const userRole:IRole = user.role as unknown as {_id:string,name:string};
    const temp =(await this.roleModel.findOne({_id:id})
    .populate({path:'permissions',select:{_id:1,apiPath:1,name:1,method:1,module:1}}))
    console.log('temp',temp);
    const objUser = {
        ...user.toObject(),
        permissions: temp?.permissions ?? []
    };
    return objUser;
 }
 async findUserLoginFacebook(id: string) {
  const user = await this.findOne(id);
  console.log('user1', user);
  if (!user || !user.role) {
      // Xử lý khi không tìm thấy user hoặc user không có role
      return null;
  }
  const userRole:IRole = user.role as unknown as {_id:string,name:string};
  const temp =(await this.roleModel.findOne({_id:id})
  .populate({path:'permissions',select:{_id:1,apiPath:1,name:1,method:1,module:1}}))
  console.log('temp',temp);
  const objUser = {
      ...user.toObject(),
      permissions: temp?.permissions ?? []
  };
  return objUser;
}
}
