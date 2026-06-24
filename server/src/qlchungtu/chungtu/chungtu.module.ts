import { Module } from '@nestjs/common';
import { ChungtuService } from './chungtu.service';
import { ChungtuController } from './chungtu.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Chungtu, ChungtuSchema } from 'src/qlchungtu/chungtu/schemas/chungtu.schema';
import { CaslModule } from 'src/casl/casl.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: Chungtu.name, schema: ChungtuSchema }]), CaslModule],
  controllers: [ChungtuController],
  providers: [ChungtuService],
})
export class ChungtuModule { }
