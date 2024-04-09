import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { DUser, ResponseMessage } from 'src/core/core';
import { IUser } from 'src/users/interface/user.interface';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}
  @ResponseMessage('Create new role')
  @Post()
  create(@Body() createRoleDto: CreateRoleDto,@DUser() user:IUser) {
    return this.rolesService.create(createRoleDto,user);
  }
  @ResponseMessage("Fetch role by paginate")
  @Get()
  findAll(@Query('current') page:string,@Query('pageSize') pageSize:string,@Query() qs:string) {
    return this.rolesService.findAll(+page,+pageSize,qs);
  }
  @ResponseMessage('Fetch role by id')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.rolesService.findOne(id);
  }
  @ResponseMessage('Update role')
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto,@DUser() user:IUser) {
    return this.rolesService.update(id, updateRoleDto,user);
  }
  @ResponseMessage('Delete role')
  @Delete(':id')
  remove(@Param('id') id: string,@DUser() user:IUser) {
    return this.rolesService.remove(id,user);
  }
}
