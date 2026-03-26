import { Module } from '@nestjs/common';
import { LoaiptnService } from './loaiptn.service';
import { LoaiptnController } from './loaiptn.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Loaiptn, LoaiptnSchema } from 'src/csvc/danhmuc/loaiptn/schemas/loaiptn.schema';
import { CaslModule } from 'src/casl/casl.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: Loaiptn.name, schema: LoaiptnSchema }]), CaslModule],
  controllers: [LoaiptnController],
  providers: [LoaiptnService],
})
export class LoaiptnModule { }
