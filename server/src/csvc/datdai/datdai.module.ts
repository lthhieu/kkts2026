import { Module } from '@nestjs/common';
import { DatdaiService } from './datdai.service';
import { DatdaiController } from './datdai.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Datdai, DatdaiSchema } from './schemas/datdai.schema';
import { CaslModule } from 'src/casl/casl.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: Datdai.name, schema: DatdaiSchema }]), CaslModule],
  controllers: [DatdaiController],
  providers: [DatdaiService],
})
export class DatdaiModule {}
