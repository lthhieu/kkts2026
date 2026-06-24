import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CaslModule } from 'src/casl/casl.module';
import { NccsController } from 'src/qlchungtu/ncc/ncc.controller';
import { NccsService } from 'src/qlchungtu/ncc/ncc.service';
import { Ncc, NccSchema } from 'src/qlchungtu/ncc/schemas/ncc.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Ncc.name, schema: NccSchema }]), CaslModule],
  controllers: [NccsController],
  providers: [NccsService],
})
export class NccsModule { }
