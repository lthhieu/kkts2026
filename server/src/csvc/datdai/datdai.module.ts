import { Module } from '@nestjs/common';
import { DatdaiService } from './datdai.service';
import { DatdaiController } from './datdai.controller';

@Module({
  controllers: [DatdaiController],
  providers: [DatdaiService],
})
export class DatdaiModule {}
