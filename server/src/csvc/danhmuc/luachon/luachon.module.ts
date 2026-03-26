import { Module } from '@nestjs/common';
import { LuachonService } from './luachon.service';
import { LuachonController } from './luachon.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Luachon, LuachonSchema } from 'src/csvc/danhmuc/luachon/schemas/luachon.schema';
import { CaslModule } from 'src/casl/casl.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: Luachon.name, schema: LuachonSchema }]), CaslModule],
  controllers: [LuachonController],
  providers: [LuachonService],
})
export class LuachonModule { }
