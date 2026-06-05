import { Module } from '@nestjs/common';
import { MaytoantruongService } from './maytoantruong.service';
import { MaytoantruongController } from './maytoantruong.controller';
import { Maytoantruong, MaytoantruongSchema } from 'src/csvc/maytoantruong/schemas/maytoantruong.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { CaslModule } from 'src/casl/casl.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: Maytoantruong.name, schema: MaytoantruongSchema }]), CaslModule],
  controllers: [MaytoantruongController],
  providers: [MaytoantruongService],
})
export class MaytoantruongModule { }
