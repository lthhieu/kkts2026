import { Module } from '@nestjs/common';
import { PtnService } from './ptn.service';
import { PtnController } from './ptn.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Ptn, PtnSchema } from './schemas/ptn.schema';
import { CaslModule } from 'src/casl/casl.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: Ptn.name, schema: PtnSchema }]), CaslModule],
  controllers: [PtnController],
  providers: [PtnService],
})
export class PtnModule {}
