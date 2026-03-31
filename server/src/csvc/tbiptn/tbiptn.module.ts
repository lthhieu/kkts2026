import { Module } from '@nestjs/common';
import { TbiptnService } from './tbiptn.service';
import { TbiptnController } from './tbiptn.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Tbiptn, TbiptnSchema } from './schemas/tbiptn.schema';
import { CaslModule } from 'src/casl/casl.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: Tbiptn.name, schema: TbiptnSchema }]), CaslModule],
  controllers: [TbiptnController],
  providers: [TbiptnService],
})
export class TbiptnModule {}
