import { IsArray, IsEmail, IsNotEmpty, IsString } from "class-validator";

export class CreateSubscriberDto {
    @IsNotEmpty({message:"Nam không được để trống"})
    name:string;
    @IsEmail({},{message:'Email không đúng định dạng'})
    @IsNotEmpty({message:"Email không được để trống"})
    email:string;
    @IsString({message:"Skills có kiểu dữ liệu chuỗi",each:true})
    @IsArray({message:"Skills có kiểu mảng"})
    skills:string[];
}
