import { MailerOptions, MailerOptionsFactory } from "@nestjs-modules/mailer";
import { HandlebarsAdapter } from "@nestjs-modules/mailer/adapters/handlebars.adapter";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { join } from "node:path";

@Injectable()
export class MailConfig implements MailerOptionsFactory {
    constructor(private configService: ConfigService) { }
    createMailerOptions(): MailerOptions {
        return {
            transport: {
                host: this.configService.get<string>('EMAIL_HOST'),
                secure: false,
                auth: {
                    user: this.configService.get<string>('EMAIL_AUTH_USER'),
                    pass: this.configService.get<string>('EMAIL_AUTH_PASS')
                }
            },
            preview: this.configService.get<string>('EMAIL_PREVIEW') === 'true' ? true : false,
            template: {
                dir: join(__dirname, '..', 'mail', 'template'),
                adapter: new HandlebarsAdapter(),
                options: {
                    strict: true,
                },
            },
        };
    }
}
