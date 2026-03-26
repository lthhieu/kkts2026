import { Module } from '@nestjs/common';
import { TinhtrangcsvcService } from './tinhtrangcsvc.service';
import { TinhtrangcsvcController } from './tinhtrangcsvc.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Tinhtrangcsvc, TinhtrangcsvcSchema } from 'src/csvc/danhmuc/tinhtrangcsvc/schemas/tinhtrangcsvc.schema';
import { CaslModule } from 'src/casl/casl.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: Tinhtrangcsvc.name, schema: TinhtrangcsvcSchema }]), CaslModule],
  controllers: [TinhtrangcsvcController],
  providers: [TinhtrangcsvcService],
})
export class TinhtrangcsvcModule { }
