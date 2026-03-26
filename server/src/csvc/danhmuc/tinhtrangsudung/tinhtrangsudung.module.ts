import { Module } from '@nestjs/common';
import { TinhtrangsudungService } from './tinhtrangsudung.service';
import { TinhtrangsudungController } from './tinhtrangsudung.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { CaslModule } from 'src/casl/casl.module';
import { Tinhtrangsudung, TinhtrangsudungSchema } from 'src/csvc/danhmuc/tinhtrangsudung/schemas/tinhtrangsudung.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Tinhtrangsudung.name, schema: TinhtrangsudungSchema }]), CaslModule],
  controllers: [TinhtrangsudungController],
  providers: [TinhtrangsudungService],
})
export class TinhtrangsudungModule { }
