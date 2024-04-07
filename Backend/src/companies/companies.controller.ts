import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { COMPANIES_ROUTE } from 'src/const/const';
import { DUser } from 'src/core/core';
import { IUser } from 'src/users/interface/user.interface';

@Controller(COMPANIES_ROUTE)
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Post()
  create(@Body() createCompanyDto: CreateCompanyDto,@DUser() user:IUser) {
    return this.companiesService.create(createCompanyDto,user);
  }

  @Get()
  findAll(@Query('page') currentPage:string,@Query('pageSize') pageSize:string,@Query() qs:string,@DUser() user:IUser) {
    return this.companiesService.findAll(+currentPage,+pageSize,qs,user);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.companiesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCompanyDto: UpdateCompanyDto,@DUser() user:IUser) {
    return this.companiesService.update(id, updateCompanyDto,user);
  }

  @Delete(':id')
  remove(@Param('id') id: string,@DUser() user:IUser) {
    return this.companiesService.remove(id,user);
  }
}
