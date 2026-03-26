import { Module } from '@nestjs/common';
import { LoaideanService } from './loaidean.service';
import { LoaideanController } from './loaidean.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Loaidean, LoaideanSchema } from 'src/csvc/danhmuc/loaidean/schemas/loaidean.schema';
import { CaslModule } from 'src/casl/casl.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: Loaidean.name, schema: LoaideanSchema }]), CaslModule],
  controllers: [LoaideanController],
  providers: [LoaideanService],
})
export class LoaideanModule { }
