import { Body, Controller, Get, Post } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { Public, ResponseMessage } from 'src/configs/my.decorator';

@Controller('mail')
export class MailController {
  constructor(private readonly mailerService: MailerService) { }


  @Post()
  @Public()
  @ResponseMessage("Gửi email thành công")
  async handleTestEmail(@Body() data: any,) {
    console.log(data)

    await this.mailerService.sendMail({
      to: ["lyhieu2024@gmail.com"],
      from: '"Support Team" <support@example.com>', // override default from
      subject: 'QTTB - Thông báo',
      template: "mail",
      context: {
        name: data.name,
        type: data.type,
        sender: data.createdBy.name,
        email: data.createdBy.email,
        description: data.description,
        device: data.device.name,
        currentRoom: data.device.currentRoom[data.device.currentRoom.length - 1].name,
        unit: data.unit.name,
        image: data.image,
      }
    });
  }

}
