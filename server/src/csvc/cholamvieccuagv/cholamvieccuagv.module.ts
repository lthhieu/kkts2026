import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CaslModule } from 'src/casl/casl.module';
import { CholamvieccuagvController } from 'src/csvc/cholamvieccuagv/cholamvieccuagv.controller';
import { CholamvieccuagvService } from 'src/csvc/cholamvieccuagv/cholamvieccuagv.service';
import { Cholamvieccuagv, CholamvieccuagvSchema } from 'src/csvc/cholamvieccuagv/schemas/cholamvieccuagv.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Cholamvieccuagv.name, schema: CholamvieccuagvSchema }]), CaslModule],
  controllers: [CholamvieccuagvController],
  providers: [CholamvieccuagvService],
})
export class CholamvieccuagvModule { }
