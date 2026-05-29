import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CaslModule } from 'src/casl/casl.module';
import { NghiencuuController } from 'src/csvc/nghiencuu/nghiencuu.controller';
import { NghiencuuService } from 'src/csvc/nghiencuu/nghiencuu.service';
import { Nghiencuu, NghiencuuSchema } from 'src/csvc/nghiencuu/schemas/nghiencuu.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Nghiencuu.name, schema: NghiencuuSchema }]), CaslModule],
  controllers: [NghiencuuController],
  providers: [NghiencuuService],
})
export class NghiencuuModule { }
