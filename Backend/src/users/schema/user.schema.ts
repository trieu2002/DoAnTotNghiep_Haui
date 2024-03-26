
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

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
  phone:string

  @Prop()
  name: string;

  @Prop()
  age:number;

  @Prop()
  address:string
}

export const UserSchema = SchemaFactory.createForClass(User);