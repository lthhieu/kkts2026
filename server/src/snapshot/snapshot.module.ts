import { Module } from '@nestjs/common';
import { SnapshotService } from './snapshot.service';
import { SnapshotController } from './snapshot.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { CaslModule } from 'src/casl/casl.module';
import { Snapshot, SnapshotSchema } from 'src/snapshot/schemas/snapshot.schema';
import { DevicesModule } from 'src/devices/devices.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: Snapshot.name, schema: SnapshotSchema }]), CaslModule, DevicesModule],
  controllers: [SnapshotController],
  providers: [SnapshotService],
})
export class SnapshotModule { }
