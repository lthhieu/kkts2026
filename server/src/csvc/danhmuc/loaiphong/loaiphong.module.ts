import { Module } from '@nestjs/common';
import { LoaiphongService } from './loaiphong.service';
import { LoaiphongController } from './loaiphong.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Loaiphong, LoaiphongSchema } from 'src/csvc/danhmuc/loaiphong/schemas/loaiphong.schema';
import { CaslModule } from 'src/casl/casl.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: Loaiphong.name, schema: LoaiphongSchema }]), CaslModule],
  controllers: [LoaiphongController],
  providers: [LoaiphongService],
})
export class LoaiphongModule { }
