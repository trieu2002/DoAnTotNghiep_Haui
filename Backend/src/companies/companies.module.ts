import { Module } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { CompaniesController } from './companies.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Company, CompanySchema } from './schema/company.schema';
import { Job, JobSchema } from 'src/jobs/schema/job.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Company.name, schema: CompanySchema },{name:Job.name,schema:JobSchema}])],
  controllers: [CompaniesController],
  providers: [CompaniesService],
})
export class CompaniesModule {}
