import { Module } from '@nestjs/common';
import { ToanhaService } from './toanha.service';
import { ToanhaController } from './toanha.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Toanha, ToanhaSchema } from './schemas/toanha.schema';
import { CaslModule } from 'src/casl/casl.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: Toanha.name, schema: ToanhaSchema }]), CaslModule],
  controllers: [ToanhaController],
  providers: [ToanhaService],
})
export class ToanhaModule {}
