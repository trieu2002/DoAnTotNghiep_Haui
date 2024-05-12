import { Controller, Get } from '@nestjs/common';
import { MailService } from './mail.service';
import { Public, ResponseMessage } from 'src/core/core';
import { MailerService } from '@nestjs-modules/mailer';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { Subscriber, SubscriberDocument } from 'src/subscribers/schema/subscriber.schema';
import { Job, JobDocument } from 'src/jobs/schema/job.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Cron } from '@nestjs/schedule';


@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService,
   private mailerService:MailerService,
   @InjectModel(Subscriber.name) private subscribeModel:SoftDeleteModel<SubscriberDocument>,
   @InjectModel(Job.name) private jobModel:SoftDeleteModel<JobDocument>

) {}
  @Cron("0 40 8 * * 0")
  @Get()
  @Public()
  @ResponseMessage("Send email")
  async handleSendEmail(){
     const subscribers=await this.subscribeModel.find({});
     for(const subs of subscribers){
         const subsSkills=subs.skills;
         const jobWithMatchingSkills=await this.jobModel.find({skills:{$in:subsSkills}});
         console.log('hihi',jobWithMatchingSkills);
         if(jobWithMatchingSkills?.length>0){
            const jobs=jobWithMatchingSkills.map(item=>{
                return {
                   name:item.name,
                   company:item?.company.name,
                   salary: `${item.salary}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + " đ",
                   skills:item.skills
                }
            })
            await this.mailerService.sendMail({
               to:"trieunguyenbaby13@gmail.com",
               from:'Support Team',
               subject:'Confirm Email',
               template:'new-job',
               context:{
                  receiver:subs.name,
                  jobs:jobs
               }
            })
         }
     }

     
  }

 
}
