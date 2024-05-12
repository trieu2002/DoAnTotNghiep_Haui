import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailController } from './mail.controller';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { MongooseModule } from '@nestjs/mongoose';
import { Subscriber, SubscriberSchema } from 'src/subscribers/schema/subscriber.schema';
import { Job, JobSchema } from 'src/jobs/schema/job.schema';
@Module({
  controllers: [MailController],
  providers: [MailService],
  imports: [
    MailerModule.forRootAsync({
    useFactory: async (configService: ConfigService) => ({
       transport: {
       host: configService.get<string>('EMAIL_HOST'),
       secure: false,
       auth: {
          user: configService.get<string>('SENDER_EMAIL'),
          pass: configService.get<string>('PASSWORD_EMAIL'),
      },
    },
    template: {
       dir: join(__dirname, 'templates'),
       adapter: new HandlebarsAdapter(),
       options: {
         strict: true,
      },
    },
    preview:false
    }),
        inject: [ConfigService],
    }),
    MongooseModule.forFeature([
      {name:Subscriber.name,schema:SubscriberSchema},
      {name:Job.name,schema:JobSchema}
    ])
  ],
})
export class MailModule {}
