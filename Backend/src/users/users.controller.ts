import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto, UpdateUserNormal } from './dto/update-user.dto';
import { USER_ROUTE } from 'src/const/const';
import { DUser, Public, ResponseMessage } from 'src/core/core';
import { IUser } from './interface/user.interface';

@Controller(USER_ROUTE)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto,@DUser() user:IUser) {
    return this.usersService.create(createUserDto,user);
  }

  @Get()
  @ResponseMessage('Fetch user by paginate')
  findAll(@Query('current') page:string,@Query('pageSize') pageSize:string,@Query() qs:string) {
    return this.usersService.findAll(+page,+pageSize,qs);
  }
  @Public()
  @ResponseMessage('Fetch user by id')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }
  @ResponseMessage('Update user')
  @Patch()
  update(@Body() updateUserDto: UpdateUserDto,@DUser() user:IUser) {
    return this.usersService.update(updateUserDto,user);
  }
  @ResponseMessage('Remove user new')
  @Delete(':id')
  remove(@Param('id') id: string,@DUser() user:IUser) {
    return this.usersService.remove(id,user);
  }
  @ResponseMessage("Update user normal")
  @Patch("/update-profile")
  updateUserNormal(@DUser() user:IUser,@Body() updateUserNormal:UpdateUserNormal){
      return this.usersService.updateUserNormal(user,updateUserNormal);
  }
}
