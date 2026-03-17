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
import { NewsModule } from './news/news.module';
import { UploadModule } from './upload/upload.module';
import { RequestsModule } from './requests/requests.module';
import { SnapshotModule } from './snapshot/snapshot.module';

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
    NewsModule,
    UploadModule,
    RequestsModule,
    SnapshotModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
