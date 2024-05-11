import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Company, CompanyDocument } from './schema/company.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IUser } from 'src/users/interface/user.interface';
import mongoose from 'mongoose';
import aqp from 'api-query-params';
import { isEmpty } from 'class-validator';
import { Job, JobDocument } from 'src/jobs/schema/job.schema';

@Injectable()
export class CompaniesService {
  constructor(@InjectModel(Company.name) private companyModel:SoftDeleteModel<CompanyDocument>,
  @InjectModel(Job.name) private jobModel:SoftDeleteModel<JobDocument>
){}
  async create(createCompanyDto: CreateCompanyDto,user:IUser) {
    return await this.companyModel.create({...createCompanyDto,createdBy:{
       _id:user?._id,
       email:user?.email
    }});
  }

  async findAll(currentPage:number,pageSize:number,qs:string,user:IUser) {
    let { filter, sort, projection, population } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;
    let defaultPageSize=+pageSize ? +pageSize : 10;
    let defaultPage=+currentPage ? +currentPage : 1;
    let offSetPage=(+defaultPage-1)*(+defaultPageSize);
    const totalItems=(await this.companyModel.find(filter)).length;
    const totalPages=Math.ceil(totalItems/defaultPageSize);
    //@ts-ignore
    if(isEmpty(sort)){
      //@ts-ignore:
       sort='-updatedAt';
    }
    const result=await this.companyModel.find(filter)
    .skip(offSetPage)
    .limit(defaultPageSize)
    //@ts-ignore
    .sort(sort)
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
      throw new NotFoundException('Không tìm tháy công ty!');
    }
    return await this.companyModel.findOne({_id:id})
  }

  async update(id: string, updateCompanyDto: UpdateCompanyDto,user:IUser) {
    if(!mongoose.Types.ObjectId.isValid(id)){
        throw new NotFoundException('Không tìm tháy công ty để cập nhật!');
    }
    return await this.companyModel.updateOne({
      _id:id
    },{
      ...updateCompanyDto,
      updatedBy:{
         _id:user?._id,
         email:user?.email
      }
    })
  }

  async remove(id: string,user:IUser) {
    if(!mongoose.Types.ObjectId.isValid(id)){
      throw new NotFoundException('Không tìm tháy công ty để xóa!');
    }
    await this.companyModel.updateOne({
      _id:id
    },{
      deletedBy:{
        _id:user?._id,
        email:user?.email
      }
    })
    return await this.companyModel.softDelete({
      _id:id
    })
  }
  async getCompanyPostJob(){
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    const companies = await this.jobModel.aggregate([
      {
        $match: {
          createdAt: { $gte: oneMonthAgo } // Lọc các tin tuyển dụng trong tháng qua
        }
      },
      {
        $group: {
          _id: "$company._id",
          name: { $first: "$company.name" },
          totalJobs: { $sum: 1 }
        }
      },
      {
        $sort: { totalJobs: -1 } // Sắp xếp theo số lượng tin tuyển dụng giảm dần
      },
      {
        $limit: 5 // Chọn ra 5 công ty đứng đầu
      }
    ]);

    return companies;
  }
}
