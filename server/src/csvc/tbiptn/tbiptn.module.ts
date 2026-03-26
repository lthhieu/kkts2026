import { Module } from '@nestjs/common';
import { TbiptnService } from './tbiptn.service';
import { TbiptnController } from './tbiptn.controller';

@Module({
  controllers: [TbiptnController],
  providers: [TbiptnService],
})
export class TbiptnModule {}
