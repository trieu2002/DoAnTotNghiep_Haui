import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserCvDto } from './dto/create-resume.dto';
import { IUser } from 'src/users/interface/user.interface';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Resume, ResumeDocument } from './schema/resume.schema';
import mongoose from 'mongoose';
import aqp from 'api-query-params';

@Injectable()
export class ResumesService {
  constructor(@InjectModel(Resume.name) private resumeModel:SoftDeleteModel<ResumeDocument>){}
  async create(createUserCvDto: CreateUserCvDto,user:IUser) {
       const {url,companyId,jobId}=createUserCvDto;
       const {email,_id}=user;
       const newCV=await this.resumeModel.create({
          url,companyId,jobId,status:'PENDING',
          createdBy:{
            _id:user?._id,
            email:user?.email
          },
          history:[
            {
              status:'PENDING',
              updatedAt:new Date(),
              updatedBy:{
                _id:user?._id,
                email:user?.email
              }
            }
          ]
       });
       return {
        _id:newCV?._id,
        createdAt:newCV?.createdAt
       }
  }

  async findAll(currentPage:number,pageSize:number,qs:string) {
    let { filter, sort, projection, population } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;
    let defaultPageSize=+pageSize ? +pageSize : 10;
    let defaultPage=+currentPage ? +currentPage : 1;
    let offSetPage=(+defaultPage-1)*(+defaultPageSize);
    const totalItems=(await this.resumeModel.find(filter)).length;
    const totalPages=Math.ceil(totalItems/defaultPageSize);
    //@ts-ignore
    if(isEmpty(sort)){
      //@ts-ignore:
       sort='-updatedAt';
    }
    const result=await this.resumeModel.find(filter)
    .skip(offSetPage)
    .limit(defaultPageSize)
    //@ts-ignore
    .sort(sort)
    .populate(population)
    .select(projection as any)
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
      throw new NotFoundException("Không tìm thấy CV ")
   };
    return await this.resumeModel.findOne({_id:id});
  }

  async update(id: string, status: string,user:IUser) {
      if(!mongoose.Types.ObjectId.isValid(id)){
         throw new NotFoundException("Không tìm thấy CV đẻ cập nhật")
      };
      const updated=await this.resumeModel.updateOne({
        _id:id
      },{
        updatedBy:{
          _id:user?._id,
          email:user?.email
        },
        $push:{
           history:{
              status:status,
              updatedAt:new Date(),
              updatedBy:{
                _id:user?._id,
                 email:user?.email
              }
           }
        }
      });
      return updated;
  }

  async remove(id: string,user:IUser) {
    if(!mongoose.Types.ObjectId.isValid(id)){
      throw new NotFoundException("Không tìm thấy CV ")
   };
    await this.resumeModel.updateOne({_id:id},{
      deletedBy:{
        _id:user?._id,
        email:user?.email
      }
    });
    return await this.resumeModel.softDelete({_id:id})
  }
  async findResumeByUser(user:IUser){
     return await this.resumeModel.find({
        userId:user?._id
     })
     .sort("-createdAt")
     .populate([
        {
          path:'companyId',
          select:{name:1}
        },{
          path:'jobId',
          select:{name:1}
        }
     ])
  }
}
