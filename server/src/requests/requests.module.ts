import { Module } from '@nestjs/common';
import { RequestsService } from './requests.service';
import { RequestsController } from './requests.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Request, RequestSchema } from 'src/requests/schemas/request.schema';
import { CaslModule } from 'src/casl/casl.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: Request.name, schema: RequestSchema }]), CaslModule],
  controllers: [RequestsController],
  providers: [RequestsService],
})
export class RequestsModule { }
