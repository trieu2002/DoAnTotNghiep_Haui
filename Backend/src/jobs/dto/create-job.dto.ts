import { Transform, Type } from "class-transformer";
import { IsArray, IsBoolean, IsDate, IsNotEmpty, IsNotEmptyObject, IsObject, IsString, ValidateNested } from "class-validator";
import mongoose from "mongoose";
class Company{
    @IsNotEmpty()
   _id:mongoose.Schema.Types.ObjectId;
    @IsNotEmpty({message:"Name company không được để trống"})
    name:string;
    @IsNotEmpty({message:"Logo company không được để trống"})
    logo:string;
}
export class CreateJobDto {
    @IsNotEmpty({message:"Tên jobs khồng được để trống"})
    name:string;
    @IsNotEmpty({message:'Skills không được để trống'})
    @IsArray({message:'Skills có định dạng mảng'})
    @IsString({message:'Skills có kiểu chuỗi'})
    skills:string[];
    @IsNotEmptyObject()
    @IsObject()
    @ValidateNested()
    @Type(()=> Company)
    company:Company
    @IsNotEmpty({message:'Địa chỉ không được để trống'})
    location:string;
    @IsNotEmpty({message:"Lương không được để trống"})
    salary:number;
    @IsNotEmpty({message:"Level không được để trống"})
    level:string;
    @IsNotEmpty({message:"Quantity không được để trống"})  
    quantity:number;
    @IsNotEmpty({message:'Mô tả không được để trống'})
    description:string;
    @IsNotEmpty({message:'StartDate không được để trống'})
    @Transform(({value})=> new Date(value))
    @IsDate({message:"StartDate có dịnh dạng Datte"})
    startDate:Date
    @IsNotEmpty({message:'EndĐate không được để trống'})
    @Transform(({value})=> new Date(value))
    @IsDate({message:"EndĐate có dịnh dạng Datte"})
    endSDate:Date
    @IsNotEmpty({message:"IsActive không đưuọc để trống"})
    @IsBoolean({message:'IsActive có kiểu là boolean'})
    isActive:Boolean
}
