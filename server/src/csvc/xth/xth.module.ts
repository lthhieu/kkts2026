import { Module } from '@nestjs/common';
import { XthService } from './xth.service';
import { XthController } from './xth.controller';

@Module({
  controllers: [XthController],
  providers: [XthService],
})
export class XthModule {}
