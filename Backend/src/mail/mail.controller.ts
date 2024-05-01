import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MailService } from './mail.service';
import { Public, ResponseMessage } from 'src/core/core';
import { MailerService } from '@nestjs-modules/mailer';


@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService,private mailerService:MailerService) {}
  
  @Get()
  @Public()
  @ResponseMessage("Send email")
  async handleSendEmail(){
     await this.mailerService.sendMail({
        to:"trieunguyenbaby13@gmail.com",
        from:'Support Team',
        subject:'Confirm Email',
        template:'new-job'
     })
  }

 
}
