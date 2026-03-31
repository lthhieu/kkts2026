import { Module } from '@nestjs/common';
import { CtkService } from './ctk.service';
import { CtkController } from './ctk.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Ctk, CtkSchema } from './schemas/ctk.schema';
import { CaslModule } from 'src/casl/casl.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: Ctk.name, schema: CtkSchema }]), CaslModule],
  controllers: [CtkController],
  providers: [CtkService],
})
export class CtkModule {}
