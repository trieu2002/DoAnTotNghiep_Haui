import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { IUser } from 'src/users/interface/user.interface';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { Permission, PermissionDocument } from './schema/permission.schema';
import aqp from 'api-query-params';
import mongoose from 'mongoose';

@Injectable()
export class PermissionsService {
  constructor(@InjectModel(Permission.name) private permissionModel:SoftDeleteModel<PermissionDocument>){}
  async create(createPermissionDto: CreatePermissionDto,user:IUser) {
     const {name,apiPath,method,module}=createPermissionDto;
     const isExist=await this.permissionModel.findOne({apiPath,method});
     if(isExist){
       throw new ConflictException("Permission này đã tồn tại!");
     };
     const newPermission=await this.permissionModel.create({
        name,apiPath,method,module,
        createdBy:{
           _id:user?._id,
           email:user?.email
        }
     });
     return {
        _id:newPermission?._id,
        createdAt:newPermission?.createdAt

     }
  }

  async findAll(currentPage:number,pageSize:number,qs:string,) {
    let { filter, sort, projection, population } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;
    let defaultPageSize=+pageSize ? +pageSize : 10;
    let defaultPage=+currentPage ? +currentPage : 1;
    let offSetPage=(+defaultPage-1)*(+defaultPageSize);
    const totalItems=(await this.permissionModel.find(filter)).length;
    const totalPages=Math.ceil(totalItems/defaultPageSize);
    //@ts-ignore
    if(isEmpty(sort)){
      //@ts-ignore:
       sort='-updatedAt';
    }
    const result=await this.permissionModel.find(filter)
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
       throw new NotFoundException("Không có quyền hạn này!")
    }
     return await this.permissionModel.findOne({_id:id})
  }

  async update(id: string, updatePermissionDto: UpdatePermissionDto,user:IUser) {
    if(!mongoose.Types.ObjectId.isValid(id)){
      throw new NotFoundException("Không có quyền hạn này!")
   }
     const updated=await this.permissionModel.updateOne({_id:id},{
      updatePermissionDto,
      updatedBy:{
         _id:user?._id,
         email:user?.email
      }
     });
     return updated;
  }

  async remove(id: string,user:IUser) {
    if(!mongoose.Types.ObjectId.isValid(id)){
      throw new NotFoundException("Không có quyền hạn này!")
   }
    await this.permissionModel.updateOne({_id:id},{
      deletedBy:{
         _id:user?._id,
         email:user?.email
      }
    });
    return await this.permissionModel.softDelete({_id:id})
  }
}
