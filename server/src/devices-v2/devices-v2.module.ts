import { Module } from '@nestjs/common';
import { DevicesV2Service } from './devices-v2.service';
import { DevicesV2Controller } from './devices-v2.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { CaslModule } from 'src/casl/casl.module';
import { DevicesV2, DevicesV2Schema } from 'src/devices-v2/schemas/devices-v2.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: DevicesV2.name, schema: DevicesV2Schema }]), CaslModule],
  controllers: [DevicesV2Controller],
  providers: [DevicesV2Service],
})
export class DevicesV2Module { }
