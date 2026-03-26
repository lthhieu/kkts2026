import { Module } from '@nestjs/common';
import { MucdichsudungcsvcService } from './mucdichsudungcsvc.service';
import { MucdichsudungcsvcController } from './mucdichsudungcsvc.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Mucdichsudungcsvc, MucdichsudungcsvcSchema } from 'src/csvc/danhmuc/mucdichsudungcsvc/schemas/mucdichsudungcsvc.schema';
import { CaslModule } from 'src/casl/casl.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: Mucdichsudungcsvc.name, schema: MucdichsudungcsvcSchema }]), CaslModule],
  controllers: [MucdichsudungcsvcController],
  providers: [MucdichsudungcsvcService],
})
export class MucdichsudungcsvcModule { }
