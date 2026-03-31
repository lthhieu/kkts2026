import { Module } from '@nestjs/common';
import { KtxService } from './ktx.service';
import { KtxController } from './ktx.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Ktx, KtxSchema } from './schemas/ktx.schema';
import { CaslModule } from 'src/casl/casl.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: Ktx.name, schema: KtxSchema }]), CaslModule],
  controllers: [KtxController],
  providers: [KtxService],
})
export class KtxModule {}
