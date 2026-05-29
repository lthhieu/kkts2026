import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CaslModule } from 'src/casl/casl.module';
import { DaphuongtienController } from 'src/csvc/daphuongtien/daphuongtien.controller';
import { DaphuongtienService } from 'src/csvc/daphuongtien/daphuongtien.service';
import { Daphuongtien, DaphuongtienSchema } from 'src/csvc/daphuongtien/schemas/daphuongtien.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Daphuongtien.name, schema: DaphuongtienSchema }]), CaslModule],
  controllers: [DaphuongtienController],
  providers: [DaphuongtienService],
})
export class DaphuongtienModule { }
