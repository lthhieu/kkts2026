import { Module } from '@nestjs/common';
import { XaphuongService } from './xaphuong.service';
import { XaphuongController } from './xaphuong.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Xaphuong, XaphuongSchema } from 'src/csvc/danhmuc/xaphuong/schemas/xaphuong.schema';
import { CaslModule } from 'src/casl/casl.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: Xaphuong.name, schema: XaphuongSchema }]), CaslModule],
  controllers: [XaphuongController],
  providers: [XaphuongService],
})
export class XaphuongModule { }
