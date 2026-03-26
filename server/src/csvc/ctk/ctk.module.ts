import { Module } from '@nestjs/common';
import { CtkService } from './ctk.service';
import { CtkController } from './ctk.controller';

@Module({
  controllers: [CtkController],
  providers: [CtkService],
})
export class CtkModule {}
