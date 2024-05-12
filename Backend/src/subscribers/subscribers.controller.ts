import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { SubscribersService } from './subscribers.service';
import { CreateSubscriberDto } from './dto/create-subscriber.dto';
import { UpdateSubscriberDto } from './dto/update-subscriber.dto';
import { DUser, ResponseMessage, SkipCheckPermission } from 'src/core/core';
import { IUser } from 'src/users/interface/user.interface';

@Controller('subscribers')
export class SubscribersController {
  constructor(private readonly subscribersService: SubscribersService) {}
  @ResponseMessage('Create new Subscribers')
  @Post()
  create(@Body() createSubscriberDto: CreateSubscriberDto,@DUser() user:IUser) {
    return this.subscribersService.create(createSubscriberDto,user);
  }

  @Get()
  @ResponseMessage('Fetch subscriber by paginate')
  findAll(@Query('current') page:string,@Query('pageSize') pageSize:string,@Query() qs:string) {
    return this.subscribersService.findAll(+page,+pageSize,qs);
  }
  @ResponseMessage("Fetch subscriber by id")
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.subscribersService.findOne(id);
  }
  @SkipCheckPermission()
  @ResponseMessage("Update subscriber")
  @Patch()
  update( @Body() updateSubscriberDto: UpdateSubscriberDto,@DUser() user:IUser) {
    return this.subscribersService.update(updateSubscriberDto,user);
  }
  
  @ResponseMessage("Delete a Subscribers")
  @Delete(':id')
  remove(@Param('id') id: string,@DUser() user:IUser) {
    return this.subscribersService.remove(id,user);
  }
  @Post('skills')
  @ResponseMessage('Get subscribers')
  @SkipCheckPermission()
  getUserSkills(@DUser() user:IUser){
     return this.subscribersService.getSkills(user);
  }
}
