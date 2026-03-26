import { Module } from '@nestjs/common';
import { PtnService } from './ptn.service';
import { PtnController } from './ptn.controller';

@Module({
  controllers: [PtnController],
  providers: [PtnService],
})
export class PtnModule {}
