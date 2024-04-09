 
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Role } from 'src/roles/schema/role.schema';

export type UserDocument = HydratedDocument<User>;
@Schema({
    timestamps:true,
    versionKey:false
})
export class User {
  @Prop()
  email: string;
  @Prop()
  password: string;
  @Prop()
  age:number
  @Prop()
  name: string;
  @Prop()
  gender:string;
  @Prop()
  address:string
  @Prop({type:mongoose.Schema.Types.ObjectId,ref:Role.name})
  role:mongoose.Schema.Types.ObjectId;
  @Prop({type:Object})
  company:{
      _id:mongoose.Schema.Types.ObjectId,
      email:string
  }
  @Prop()
  refreshToken:string
  @Prop()
  createdAt:Date
  @Prop()
  updatedAt:Date
  @Prop()
  isDeleted:Boolean
  @Prop({type:Object})
  createdBy:{
      _id:mongoose.Schema.Types.ObjectId,
      email:string
  }
  @Prop({type:Object})
  updatedBy:{
       _id:mongoose.Schema.Types.ObjectId,
       email:string
  }
  @Prop({type:Object})
  deletedBy:{
       _id:mongoose.Schema.Types.ObjectId,
       email:string
  }
}

export const UserSchema = SchemaFactory.createForClass(User);