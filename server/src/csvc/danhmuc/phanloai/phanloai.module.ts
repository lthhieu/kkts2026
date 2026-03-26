import { Module } from '@nestjs/common';
import { PhanloaiService } from './phanloai.service';
import { PhanloaiController } from './phanloai.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Phanloai, PhanloaiSchema } from 'src/csvc/danhmuc/phanloai/schemas/phanloai.schema';
import { CaslModule } from 'src/casl/casl.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: Phanloai.name, schema: PhanloaiSchema }]), CaslModule],
  controllers: [PhanloaiController],
  providers: [PhanloaiService],
})
export class PhanloaiModule { }
