import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { Role, RoleDocument } from './schema/role.schema';
import { InjectModel } from '@nestjs/mongoose';
import { IUser } from 'src/users/interface/user.interface';
import aqp from 'api-query-params';
import mongoose from 'mongoose';

@Injectable()
export class RolesService {
  constructor(@InjectModel(Role.name) private roleModel:SoftDeleteModel<RoleDocument>){}
  async create(createRoleDto: CreateRoleDto,user:IUser) {
     const {name,description,isActive,permissions}=createRoleDto;
     const isExist=await this.roleModel.findOne({name}); 
     if(isExist){
        throw new ConflictException('Role này đã tồn tại!')
     };
     const newRole=await this.roleModel.create({
       name,description,isActive,permissions,
       createdBy:{
         _id:user?._id,
         email:user?.email
       }
     });
     return {
        _id:newRole?._id,
        createdAt:newRole?.createdAt
     }
  }

  async findAll(currentPage:number,pageSize:number,qs:string,) {
    let { filter, sort, projection, population } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;
    let defaultPageSize=+pageSize ? +pageSize : 10;
    let defaultPage=+currentPage ? +currentPage : 1;
    let offSetPage=(+defaultPage-1)*(+defaultPageSize);
    const totalItems=(await this.roleModel.find(filter)).length;
    const totalPages=Math.ceil(totalItems/defaultPageSize);
    //@ts-ignore
    if(isEmpty(sort)){
      //@ts-ignore:
       sort='-updatedAt';
    }
    const result=await this.roleModel.find(filter)
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
       throw new NotFoundException("Không tinm tháy quyền này");
    }
   return (await this.roleModel.findOne({_id:id})
    .populate({path:'permissions',select:{_id:1,apiPath:1,name:1,method:1,module:1}}))
  }

  async update(id: string, updateRoleDto: UpdateRoleDto,user:IUser) {
    if(!mongoose.Types.ObjectId.isValid(id)){
      throw new NotFoundException("Không tinm tháy quyền này");
   }
   const {name,description,isActive,permissions}=updateRoleDto;

     const updated=await this.roleModel.updateOne({_id:id},{
        name,description,isActive,permissions,
        updatedBy:{
          _id:user?._id,
          email:user?.email
        }
     });
     return updated;
  }

  async remove(id: string,user:IUser) {
    if(!mongoose.Types.ObjectId.isValid(id)){
      throw new NotFoundException("Không tinm tháy quyền này");
   };
  const foundRole=await this.roleModel.findOne({_id:user?._id});
  if(foundRole.name==='ADMIN'){
     throw new BadRequestException("Không được xóa role ADMIN");
  }
   await this.roleModel.updateOne({
      _Id:IDBCursorWithValue
   },{
      deletedBy:{
         _id:user?._id,
         email:user?.email
      }
   });
   return await this.roleModel.softDelete({_id:id})
  }
}
