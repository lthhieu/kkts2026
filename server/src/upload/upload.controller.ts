import { BadRequestException, Controller, Post, Req, UploadedFile, UseFilters, UseInterceptors } from '@nestjs/common';
import { UploadService } from './upload.service';
import { CheckPolicies, ResponseMessage } from 'src/configs/my.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { HttpExceptionFilter } from 'src/configs/http-exception.filter';
import { AppAbility } from 'src/casl/casl-ability.factory/casl-ability.factory';
import { Action, UploadSubject } from 'src/configs/enum';
import { ConfigService } from '@nestjs/config';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService,
    private configService: ConfigService
  ) { }

  @Post('single-image')
  @ResponseMessage('Tải ảnh thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Create, UploadSubject))
  @UseInterceptors(FileInterceptor('file'))
  @UseFilters(new HttpExceptionFilter())
  uploadFile(@UploadedFile() file: Express.Multer.File, @Req() req: Request) {
    if (file && file.filename) {
      return {
        filename: file?.filename,
        folder: req.headers['folder_type'] ?? "default",
        link: `/images?folder=${req.headers['folder_type'] ?? "default"}&name=${file.filename}`
      }
    } else {
      throw new BadRequestException('Không tìm thấy tài liệu của bạn')
    }
  }
}
