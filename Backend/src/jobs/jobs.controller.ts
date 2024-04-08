import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { JOBS_ROUTE } from 'src/const/const';
import { DUser, Public, ResponseMessage } from 'src/core/core';
import { IUser } from 'src/users/interface/user.interface';

@Controller(JOBS_ROUTE)
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @ResponseMessage('Create new jobs')
  @Post()
  create(@Body() createJobDto: CreateJobDto,@DUser() user:IUser) {
    return this.jobsService.create(createJobDto,user);
  }
  @ResponseMessage('Fetch job by paginate')
  @Get()
  findAll(@Query('current') page:string,@Query('pageSize') pageSize:string,@Query() qs:string) {
    return this.jobsService.findAll(+page,+pageSize,qs);
  }
  @ResponseMessage('Fetch job by id')
  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.jobsService.findOne(id);
  }
  @ResponseMessage('Update jobs')
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateJobDto: UpdateJobDto,@DUser() user:IUser) {
    return this.jobsService.update(id, updateJobDto,user);
  }
  @ResponseMessage('Delete jobs')
  @Delete(':id')
  remove(@Param('id') id: string,@DUser() user:IUser) {
    return this.jobsService.remove(id,user);
  }
}
