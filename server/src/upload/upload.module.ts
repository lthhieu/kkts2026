import { Module } from '@nestjs/common';
import { UploadService } from './upload.service';
import { UploadController } from './upload.controller';
import { MulterModule } from '@nestjs/platform-express';
import { MulterConfigService } from 'src/configs/multer.config';

@Module({
  controllers: [UploadController],
  providers: [UploadService],
  imports: [
    MulterModule.registerAsync({
      useClass: MulterConfigService,
    })
  ]
})
export class UploadModule { }
