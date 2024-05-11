import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsEmail, IsNotEmpty } from 'class-validator';
export class UpdateUserDto extends OmitType(CreateUserDto,['password'] as const) {
    @IsNotEmpty({message:'Id không được để trống'})
    _id:string;
}
export class UpdateUserNormal {
    @IsNotEmpty({message:"Email không được dể trống"})
    @IsEmail({},{message:'Email không đúng định dạng'})
    email:string;
    @IsNotEmpty({message:"Name không được dể trống"})
    name:string;
    @IsNotEmpty({message:'Age không được để trống'})
    age:number;
    @IsNotEmpty({message:"Gender không dược để trống"})
    gender:string;
    @IsNotEmpty({message:"Address không được để trống"})
    address:string;
}
