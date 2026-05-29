import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CaslModule } from 'src/casl/casl.module';
import { Thuchanh, ThuchanhSchema } from 'src/csvc/thuchanh/schemas/thuchanh.schema';
import { ThuchanhController } from 'src/csvc/thuchanh/thuchanh.controller';
import { ThuchanhService } from 'src/csvc/thuchanh/thuchanh.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: Thuchanh.name, schema: ThuchanhSchema }]), CaslModule],
  controllers: [ThuchanhController],
  providers: [ThuchanhService],
})
export class ThuchanhModule { }
