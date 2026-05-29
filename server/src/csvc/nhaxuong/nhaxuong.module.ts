import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CaslModule } from 'src/casl/casl.module';
import { NhaxuongController } from 'src/csvc/nhaxuong/nhaxuong.controller';
import { NhaxuongService } from 'src/csvc/nhaxuong/nhaxuong.service';
import { Nhaxuong, NhaxuongSchema } from 'src/csvc/nhaxuong/schemas/nhaxuong.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Nhaxuong.name, schema: NhaxuongSchema }]), CaslModule],
  controllers: [NhaxuongController],
  providers: [NhaxuongService],
})
export class NhaxuongModule { }
