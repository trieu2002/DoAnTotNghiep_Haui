
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
export type JobDocument = HydratedDocument<Job>;
@Schema({
    timestamps:true,
    versionKey:false
})
export class Job {
  @Prop()
  name: string;
  @Prop()
  skills: string[];
  @Prop()
  location:string
  @Prop()
  @Prop()
  salary:number;
  @Prop()
  quantity:number;
  @Prop()
  level:string;
  @Prop({type:Object})
  company:{
      _id:mongoose.Schema.Types.ObjectId,
      email:string
  }
  @Prop()
  description:string;
  @Prop()
  startDate:Date
  @Prop()
  endDate:Date
  @Prop()
  isActive:Boolean
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

export const JobSchema = SchemaFactory.createForClass(Job);