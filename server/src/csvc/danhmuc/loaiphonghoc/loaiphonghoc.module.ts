import { Module } from '@nestjs/common';
import { LoaiphonghocService } from './loaiphonghoc.service';
import { LoaiphonghocController } from './loaiphonghoc.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Loaiphonghoc, LoaiphonghocSchema } from 'src/csvc/danhmuc/loaiphonghoc/schemas/loaiphonghoc.schema';
import { CaslModule } from 'src/casl/casl.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: Loaiphonghoc.name, schema: LoaiphonghocSchema }]), CaslModule],
  controllers: [LoaiphonghocController],
  providers: [LoaiphonghocService],
})
export class LoaiphonghocModule { }
