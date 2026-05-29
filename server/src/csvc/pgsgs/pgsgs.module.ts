import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CaslModule } from 'src/casl/casl.module';
import { PgsgsController } from 'src/csvc/pgsgs/pgsgs.controller';
import { PgsgsService } from 'src/csvc/pgsgs/pgsgs.service';
import { Pgsgs, PgsgsSchema } from 'src/csvc/pgsgs/schemas/pgsgs.schema';
@Module({
  imports: [MongooseModule.forFeature([{ name: Pgsgs.name, schema: PgsgsSchema }]), CaslModule],
  controllers: [PgsgsController],
  providers: [PgsgsService],
})
export class PgsgsModule { }
