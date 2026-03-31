import { Module } from '@nestjs/common';
import { XthService } from './xth.service';
import { XthController } from './xth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Xth, XthSchema } from './schemas/xth.schema';
import { CaslModule } from 'src/casl/casl.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: Xth.name, schema: XthSchema }]), CaslModule],
  controllers: [XthController],
  providers: [XthService],
})
export class XthModule {}
