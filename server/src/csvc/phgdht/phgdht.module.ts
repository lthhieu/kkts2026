import { Module } from '@nestjs/common';
import { PhgdhtService } from './phgdht.service';
import { PhgdhtController } from './phgdht.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Phgdht, PhgdhtSchema } from './schemas/phgdht.schema';
import { CaslModule } from 'src/casl/casl.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: Phgdht.name, schema: PhgdhtSchema }]), CaslModule],
  controllers: [PhgdhtController],
  providers: [PhgdhtService],
})
export class PhgdhtModule {}
