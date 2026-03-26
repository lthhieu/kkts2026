import { Module } from '@nestjs/common';
import { LoaicongtrinhcsvcService } from './loaicongtrinhcsvc.service';
import { LoaicongtrinhcsvcController } from './loaicongtrinhcsvc.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Loaicongtrinhcsvc, LoaicongtrinhcsvcSchema } from 'src/csvc/danhmuc/loaicongtrinhcsvc/schemas/loaicongtrinhcsvc.schema';
import { CaslModule } from 'src/casl/casl.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: Loaicongtrinhcsvc.name, schema: LoaicongtrinhcsvcSchema }]), CaslModule],
  controllers: [LoaicongtrinhcsvcController],
  providers: [LoaicongtrinhcsvcService],
})
export class LoaicongtrinhcsvcModule { }
