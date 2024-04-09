import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { DUser, ResponseMessage } from 'src/core/core';
import { IUser } from 'src/users/interface/user.interface';

@Controller('permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Post()
  @ResponseMessage("Create new permission")
  create(@Body() createPermissionDto: CreatePermissionDto,@DUser() user:IUser) {
    return this.permissionsService.create(createPermissionDto,user);
  }
  @ResponseMessage("Fetch permission by paginate")
  @Get()
  findAll(@Query('current') page:string,@Query('pageSize') pageSize:string,@Query() qs:string) {
    return this.permissionsService.findAll(+page,+pageSize,qs);
  }
  @ResponseMessage("fetch permission by id")
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.permissionsService.findOne(id);
  }
  @ResponseMessage("Update permission")
  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePermissionDto: UpdatePermissionDto,@DUser() user:IUser) {
    return this.permissionsService.update(id, updatePermissionDto,user);
  }
  @ResponseMessage("Delete permission")
  @Delete(':id')
  remove(@Param('id') id: string,@DUser() user:IUser) {
    return this.permissionsService.remove(id,user);
  }
}
