import { Module } from '@nestjs/common';
import { DatabasesService } from './databases.service';
import { DatabasesController } from './databases.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/users/schemas/user.schema';
import { Unit, UnitSchema } from 'src/units/schemas/unit.schema';
import { Room, RoomSchema } from 'src/rooms/schemas/room.schema';
import { UsersService } from 'src/users/users.service';

@Module({
  controllers: [DatabasesController],
  providers: [DatabasesService, UsersService],
  imports: [MongooseModule.forFeature([
    { name: User.name, schema: UserSchema },
    // { name: Room.name, schema: RoomSchema },
    { name: Unit.name, schema: UnitSchema },
  ])],
})
export class DatabasesModule { }
