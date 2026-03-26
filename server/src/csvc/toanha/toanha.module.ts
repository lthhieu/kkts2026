import { Module } from '@nestjs/common';
import { ToanhaService } from './toanha.service';
import { ToanhaController } from './toanha.controller';

@Module({
  controllers: [ToanhaController],
  providers: [ToanhaService],
})
export class ToanhaModule {}
