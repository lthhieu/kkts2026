import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailController } from './mail.controller';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/adapters/handlebars.adapter';
import { MailConfig } from 'src/configs/mail.config';


@Module({
  imports: [
    MailerModule.forRootAsync({
      useClass: MailConfig,
    }),
    // MongooseModule.forFeature([{ name: Subscriber.name, schema: SubscriberSchema },
    // { name: Job.name, schema: JobSchema }])
  ],
  controllers: [MailController],
  providers: [MailService],
})
export class MailModule { }
