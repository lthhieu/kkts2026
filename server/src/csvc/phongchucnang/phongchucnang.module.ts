import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CaslModule } from 'src/casl/casl.module';
import { PhongchucnangController } from 'src/csvc/phongchucnang/phongchucnang.controller';
import { PhongchucnangService } from 'src/csvc/phongchucnang/phongchucnang.service';
import { Phongchucnang, PhongchucnangSchema } from 'src/csvc/phongchucnang/schemas/phongchucnang.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Phongchucnang.name, schema: PhongchucnangSchema }]), CaslModule],
  controllers: [PhongchucnangController],
  providers: [PhongchucnangService],
})
export class PhongchucnangModule { }
