import { Module } from '@nestjs/common';
import { ThuvienService } from './thuvien.service';
import { ThuvienController } from './thuvien.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Thuvien, ThuvienSchema } from './schemas/thuvien.schema';
import { CaslModule } from 'src/casl/casl.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: Thuvien.name, schema: ThuvienSchema }]), CaslModule],
  controllers: [ThuvienController],
  providers: [ThuvienService],
})
export class ThuvienModule {}
