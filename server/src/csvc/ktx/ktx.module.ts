import { Module } from '@nestjs/common';
import { KtxService } from './ktx.service';
import { KtxController } from './ktx.controller';

@Module({
  controllers: [KtxController],
  providers: [KtxService],
})
export class KtxModule {}
