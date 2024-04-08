import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { Job, JobDocument } from './schema/job.schema';
import { IUser } from 'src/users/interface/user.interface';
import mongoose from 'mongoose';
import aqp from 'api-query-params';
import { isEmpty } from 'class-validator';

@Injectable()
export class JobsService {
  constructor(@InjectModel(Job.name) private jobModel:SoftDeleteModel<JobDocument>){}
  async create(createJobDto: CreateJobDto,user:IUser) {
    const newJob=await this.jobModel.create({...createJobDto,createdBy:{
       _id:user?._id,
       email:user?.email
    }});
    return {
        _id:newJob?._id,
        createdAt:newJob?.createdAt
    }
  }

  async findAll(currentPage:number,pageSize:number,qs:string) {
    let { filter, sort, projection, population } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;
    let defaultPageSize=+pageSize ? +pageSize : 10;
    let defaultPage=+currentPage ? +currentPage : 1;
    let offSetPage=(+defaultPage-1)*(+defaultPageSize);
    const totalItems=(await this.jobModel.find(filter)).length;
    const totalPages=Math.ceil(totalItems/defaultPageSize);
    //@ts-ignore
    if(isEmpty(sort)){
      //@ts-ignore:
       sort='-updatedAt';
    }
    const result=await this.jobModel.find(filter)
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
      throw new NotFoundException('Khồng tồn tại jobs này');
    }
    return await this.jobModel.findOne({_id:id})
  }

  async update(id: string, updateJobDto: UpdateJobDto,user:IUser) {
    if(!mongoose.Types.ObjectId.isValid(id)){
        throw new NotFoundException('Khồng tồn tại jobs này');
    }
    return await this.jobModel.updateOne({_id:id},{...updateJobDto,updatedBy:{
      _id:user?._id,
      email:user?.email
    }})
  }

  async remove(id: string,user:IUser) {
    if(!mongoose.Types.ObjectId.isValid(id)){
      throw new NotFoundException('Khồng tồn tại jobs này');
  }
   await this.jobModel.updateOne({_id:id},{deletedBy:{
     _id:user?._id,
     email:user?.email
   }});
   return this.jobModel.softDelete({_id:id})
  }
}
