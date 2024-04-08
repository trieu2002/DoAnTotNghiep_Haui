
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Company } from 'src/companies/schema/company.schema';
import { Job } from 'src/jobs/schema/job.schema';
export type ResumeDocument = HydratedDocument<Resume>;
@Schema({
    timestamps:true,
    versionKey:false
})
export class Resume {
  @Prop()
  email: string;
  @Prop()
  userId: mongoose.Schema.Types.ObjectId;
  @Prop()
  url:string
  @Prop()
  status:string;
  @Prop({type:mongoose.Schema.Types.ObjectId,ref:Company.name})
  companyId:mongoose.Schema.Types.ObjectId;
  @Prop({type:mongoose.Schema.Types.ObjectId,ref:Job.name})
  jobId:mongoose.Schema.Types.ObjectId;
  @Prop({type:mongoose.Schema.Types.Array})
  history: {
    status:string,
    updatedAt:Date,
    updatedBy:{
       _id:mongoose.Schema.Types.ObjectId,
       email:string
    }
  }[]
     

  
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

export const ResumeSchema = SchemaFactory.createForClass(Resume);