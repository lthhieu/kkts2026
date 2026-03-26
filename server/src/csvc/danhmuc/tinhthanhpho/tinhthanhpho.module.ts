import { Module } from '@nestjs/common';
import { TinhthanhphoService } from './tinhthanhpho.service';
import { TinhthanhphoController } from './tinhthanhpho.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Tinhthanhpho, TinhthanhphoSchema } from 'src/csvc/danhmuc/tinhthanhpho/schemas/tinhthanhpho.schema';
import { CaslModule } from 'src/casl/casl.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: Tinhthanhpho.name, schema: TinhthanhphoSchema }]), CaslModule],
  controllers: [TinhthanhphoController],
  providers: [TinhthanhphoService],
})
export class TinhthanhphoModule { }
