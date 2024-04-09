import { IsArray, IsBoolean, IsMongoId, IsNotEmpty } from "class-validator";
import mongoose from "mongoose";

export class CreateRoleDto {
    @IsNotEmpty({message:"Name không được để trống"})
    name:string;
    @IsNotEmpty({message:"Description không được để trống"})
    description:string;
    @IsNotEmpty({message:"IsActive không được để trống"})
    @IsBoolean({message:"IsActive là kieur boolean"})
    isActive:Boolean;
    @IsNotEmpty({message:"Permisison không được để trống"})
    @IsMongoId({message:"Permisson có kiểu mongoid"})
    @IsArray({message:'Permission có dạng array'})
    permissions:mongoose.Schema.Types.ObjectId[]

}
