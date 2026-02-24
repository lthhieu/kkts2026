import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { MongooseConfigService } from 'src/configs/mongoose.config.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { UnitsModule } from './units/units.module';
import { RoomsModule } from './rooms/rooms.module';
import { DevicesModule } from './devices/devices.module';
import { CaslModule } from './casl/casl.module';
import { DatabasesModule } from './databases/databases.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true, }),
  MongooseModule.forRootAsync({ useClass: MongooseConfigService, }),
    UsersModule,
    AuthModule,
    UnitsModule,
    RoomsModule,
    DevicesModule,
    CaslModule,
    DatabasesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
