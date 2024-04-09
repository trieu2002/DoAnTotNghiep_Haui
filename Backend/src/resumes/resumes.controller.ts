import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ResumesService } from './resumes.service';
import { CreateUserCvDto } from './dto/create-resume.dto';
import { DUser, Public, ResponseMessage } from 'src/core/core';
import { IUser } from 'src/users/interface/user.interface';

@Controller('resumes')
export class ResumesController {
  constructor(private readonly resumesService: ResumesService) {}

  @Post()
  @ResponseMessage('Create new resume')
  create(@Body() createUserCvDto: CreateUserCvDto,@DUser() user:IUser) {
    return this.resumesService.create(createUserCvDto,user);
  }
  @ResponseMessage('Fetch resume by paginate')
  @Get()
  @Public()
  findAll(@Query('current') page:string,@Query('pageSize') pageSize:string,@Query() qs:string) {
    return this.resumesService.findAll(+page,+pageSize,qs);
  }

  @Get(':id')
  @Public()
  @ResponseMessage('fetch resume by id')
  findOne(@Param('id') id: string) {
    return this.resumesService.findOne(id);
  }
  @ResponseMessage('Update CV')
  @Patch(':id')
  update(@Param('id') id: string, @Body('status') status:string,@DUser() user:IUser) {
    return this.resumesService.update(id, status,user);
  }
  @ResponseMessage('Delete Cv')
  @Delete(':id')
  remove(@Param('id') id: string,@DUser() user:IUser) {
    return this.resumesService.remove(id,user);
  }
  @ResponseMessage('Get resume by user')
  @Post('by-user')
  getResumeByUser(@DUser() user:IUser){
     return this.resumesService.findResumeByUser(user);
  }
}
