import { ConflictException, Injectable } from '@nestjs/common';
import { CreateSubscriberDto } from './dto/create-subscriber.dto';
import { UpdateSubscriberDto } from './dto/update-subscriber.dto';
import { IUser } from 'src/users/interface/user.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Subscriber, SubscriberDocument } from './schema/subscriber.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import aqp from 'api-query-params';
import { isEmpty } from 'class-validator';

@Injectable()
export class SubscribersService {
  constructor(@InjectModel(Subscriber.name) private subscriberModel:SoftDeleteModel<SubscriberDocument>){}
  async create(createSubscriberDto: CreateSubscriberDto,user:IUser) {
     const {name,email,skills}=createSubscriberDto;
     const exits=await this.subscriberModel.findOne({email});
     if(exits){
        throw new ConflictException('Email đã tồn tại trên hệ thống.Vui lòng chọn tài khoản khác')
     };
     let newSubs=await this.subscriberModel.create({
        name,email,skills,
        createdBy:{
          _id:user?._id,
          email:user?.email
        }
     });
     return {
        _id:newSubs?._id,
        createdAt:newSubs?.createdAt
     }
  }

  async findAll(currentPage:number,pageSize:number,qs:string) {
    let { filter, sort, projection, population } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;
    let defaultPageSize=+pageSize ? +pageSize : 10;
    let defaultPage=+currentPage ? +currentPage : 1;
    let offSetPage=(+defaultPage-1)*(+defaultPageSize);
    const totalItems=(await this.subscriberModel.find(filter)).length;
    const totalPages=Math.ceil(totalItems/defaultPageSize);
    //@ts-ignore
    if(isEmpty(sort)){
      //@ts-ignore:
       sort='-updatedAt';
    }
    const result=await this.subscriberModel.find(filter)
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

  findOne(id: string) {
    return `This action returns a #${id} subscriber`;
  }

  update(id: string, updateSubscriberDto: UpdateSubscriberDto,user:IUser) {
    return `This action updates a #${id} subscriber`;
  }

  remove(id: string,user:IUser) {
    return `This action removes a #${id} subscriber`;
  }
}
