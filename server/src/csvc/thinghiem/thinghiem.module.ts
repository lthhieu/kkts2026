import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CaslModule } from 'src/casl/casl.module';
import { Thinghiem, ThinghiemSchema } from 'src/csvc/thinghiem/schemas/thignhiem.schema';
import { ThinghiemController } from 'src/csvc/thinghiem/thinghiem.controller';
import { ThinghiemService } from 'src/csvc/thinghiem/thinghiem.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: Thinghiem.name, schema: ThinghiemSchema }]), CaslModule],
  controllers: [ThinghiemController],
  providers: [ThinghiemService],
})
export class ThinghiemModule { }
