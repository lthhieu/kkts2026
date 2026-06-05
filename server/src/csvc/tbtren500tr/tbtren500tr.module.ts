import { Module } from '@nestjs/common';
import { Tbtren500trService } from './tbtren500tr.service';
import { Tbtren500trController } from './tbtren500tr.controller';
import { MongooseModule } from '@nestjs/mongoose/dist/mongoose.module';
import { CaslModule } from 'src/casl/casl.module';
import { Tbtren500tr, Tbtren500trSchema } from 'src/csvc/tbtren500tr/schemas/tbtren500tr.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Tbtren500tr.name, schema: Tbtren500trSchema }]), CaslModule],
  controllers: [Tbtren500trController],
  providers: [Tbtren500trService],
})
export class Tbtren500trModule { }
