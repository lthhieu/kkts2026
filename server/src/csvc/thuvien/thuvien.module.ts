import { Module } from '@nestjs/common';
import { ThuvienService } from './thuvien.service';
import { ThuvienController } from './thuvien.controller';

@Module({
  controllers: [ThuvienController],
  providers: [ThuvienService],
})
export class ThuvienModule {}
