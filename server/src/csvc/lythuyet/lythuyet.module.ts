import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CaslModule } from 'src/casl/casl.module';
import { LythuyetController } from 'src/csvc/lythuyet/lythuyet.controller';
import { LythuyetService } from 'src/csvc/lythuyet/lythuyet.service';
import { Lythuyet, LythuyetSchema } from 'src/csvc/lythuyet/schemas/lythuyet.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Lythuyet.name, schema: LythuyetSchema }]), CaslModule],
  controllers: [LythuyetController],
  providers: [LythuyetService],
})
export class LythuyetModule { }
