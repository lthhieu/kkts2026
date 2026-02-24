import { Module } from '@nestjs/common';
import { UnitsService } from './units.service';
import { UnitsController } from './units.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Unit, UnitSchema } from 'src/units/schemas/unit.schema';
import { CaslModule } from 'src/casl/casl.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: Unit.name, schema: UnitSchema }]), CaslModule],
  controllers: [UnitsController],
  providers: [UnitsService],
})
export class UnitsModule { }
