import { Module } from '@nestjs/common';
import { HinhthucsohuuService } from './hinhthucsohuu.service';
import { HinhthucsohuuController } from './hinhthucsohuu.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Hinhthucsohuu, HinhthucsohuuSchema } from 'src/csvc/danhmuc/hinhthucsohuu/schemas/hinhthucsohuu.schema';
import { CaslModule } from 'src/casl/casl.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: Hinhthucsohuu.name, schema: HinhthucsohuuSchema }]), CaslModule],
  controllers: [HinhthucsohuuController],
  providers: [HinhthucsohuuService],
})
export class HinhthucsohuuModule { }
