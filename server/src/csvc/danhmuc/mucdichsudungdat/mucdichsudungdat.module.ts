import { Module } from '@nestjs/common';
import { MucdichsudungdatService } from './mucdichsudungdat.service';
import { MucdichsudungdatController } from './mucdichsudungdat.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Mucdichsudungdat, MucdichsudungdatSchema } from 'src/csvc/danhmuc/mucdichsudungdat/schemas/mucdichsudungdat.schema';
import { CaslModule } from 'src/casl/casl.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: Mucdichsudungdat.name, schema: MucdichsudungdatSchema }]), CaslModule],
  controllers: [MucdichsudungdatController],
  providers: [MucdichsudungdatService],
})
export class MucdichsudungdatModule { }
