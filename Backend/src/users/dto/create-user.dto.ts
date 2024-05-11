import { Type } from "class-transformer";
import { IsEmail, IsMongoId, IsNotEmpty, IsNotEmptyObject, IsObject, ValidateNested } from "class-validator";
import mongoose, { Types } from "mongoose";
class Company{
     @IsNotEmpty()
    _id:mongoose.Schema.Types.ObjectId;
    @IsNotEmpty({message:"Name company không được để trống"})
    name:string;
}
export class CreateUserDto {
    @IsNotEmpty({message:"Email không được dể trống"})
    @IsEmail({},{message:'Email không đúng định dạng'})
    email:string;
    @IsNotEmpty({message:"Mật khẩu không được để trống"})
    password:string;
    @IsNotEmpty({message:"Name không được dể trống"})
    name:string;
    @IsNotEmpty({message:'Age không được để trống'})
    age:number;
    @IsNotEmpty({message:"Gender không dược để trống"})
    gender:string;
    @IsNotEmpty({message:"Address không được để trống"})
    address:string;
    @IsNotEmpty({message:"Role không được để trống"})
    @IsMongoId({message:'role là mongoid'})
    role:mongoose.Schema.Types.ObjectId;
    @IsNotEmptyObject()
    @IsObject()
    @ValidateNested()
    @Type(()=> Company)
    company:Company
}
export class CreateRegisterDto {
    @IsNotEmpty({message:"Email không được dể trống"})
    @IsEmail({},{message:'Email không đúng định dạng'})
    email:string;
    @IsNotEmpty({message:"Mật khẩu không được để trống"})
    password:string;
    @IsNotEmpty({message:"Name không được dể trống"})
    name:string;
    @IsNotEmpty({message:'Age không được để trống'})
    age:number;
    @IsNotEmpty({message:"Gender không dược để trống"})
    gender:string;
    @IsNotEmpty({message:"Address không được để trống"})
    address:string;
    typeAcc:string
}
