import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailController } from './mail.controller';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
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
    preview:configService.get<string>('EMAIL_PREVIEW') === 'true' ? true : false
    }),
        inject: [ConfigService],
    }),
  ],
})
export class MailModule {}
