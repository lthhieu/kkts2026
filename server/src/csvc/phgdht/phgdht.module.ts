import { Module } from '@nestjs/common';
import { PhgdhtService } from './phgdht.service';
import { PhgdhtController } from './phgdht.controller';

@Module({
  controllers: [PhgdhtController],
  providers: [PhgdhtService],
})
export class PhgdhtModule {}
