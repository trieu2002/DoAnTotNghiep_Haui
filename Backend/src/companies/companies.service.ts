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

@Injectable()
export class CompaniesService {
  constructor(@InjectModel(Company.name) private companyModel:SoftDeleteModel<CompanyDocument>){}
  async create(createCompanyDto: CreateCompanyDto,user:IUser) {
    return await this.companyModel.create({...createCompanyDto,createdBy:{
       _id:user?._id,
       email:user?.email
    }});
  }

  async findAll(currentPage:number,pageSize:number,qs:string,user:IUser) {
    const { filter, sort, projection, population } = aqp(qs);
    delete filter.page;
    delete filter.limit;
    let offset=(+currentPage-1)*(+pageSize);
    let defaultLimit=(+pageSize) ? +pageSize : 10;
    const totalItems=(await this.companyModel.find(filter)).length;
    const totalPages=Math.ceil(totalItems/defaultLimit);
    if (isEmpty(sort)) {
      // @ts-ignore: Unreachable code error
      sort = "-updatedAt"
    }
    const result = await this.companyModel.find(filter)
       .skip(offset)
       .limit(defaultLimit)
       // @ts-ignore: Unreachable code error
       .sort(sort)
       .populate(population)
       .exec();
    return {
        meta: {
        current: currentPage, //trang hiện tại
        pageSize: pageSize, //số lượng bản ghi đã lấy
        pages: totalPages, //tổng số trang với điều kiện query
        total: totalItems // tổng số phần tử (số bản ghi)
        },
        result //kết quả query
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
}
