import { Module } from '@nestjs/common';
import { HinhthucsudungService } from './hinhthucsudung.service';
import { HinhthucsudungController } from './hinhthucsudung.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Hinhthucsudung, HinhthucsudungSchema } from 'src/csvc/danhmuc/hinhthucsudung/schemas/hinhthucsudung.schema';
import { CaslModule } from 'src/casl/casl.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: Hinhthucsudung.name, schema: HinhthucsudungSchema }]), CaslModule],
  controllers: [HinhthucsudungController],
  providers: [HinhthucsudungService],
})
export class HinhthucsudungModule { }
