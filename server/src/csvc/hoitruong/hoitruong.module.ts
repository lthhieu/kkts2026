import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CaslModule } from 'src/casl/casl.module';
import { HoitruongController } from 'src/csvc/hoitruong/hoitruong.controller';
import { HoitruongService } from 'src/csvc/hoitruong/hoitruong.service';
import { Hoitruong, HoitruongSchema } from 'src/csvc/hoitruong/schemas/hoitruong.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Hoitruong.name, schema: HoitruongSchema }]), CaslModule],
  controllers: [HoitruongController],
  providers: [HoitruongService],
})
export class HoitruongModule { }
