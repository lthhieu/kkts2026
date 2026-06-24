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
import { DatdaiModule } from './csvc/datdai/datdai.module';
import { ToanhaModule } from './csvc/toanha/toanha.module';
import { KtxModule } from './csvc/ktx/ktx.module';
import { ThuvienModule } from './csvc/thuvien/thuvien.module';
import { MailModule } from './mail/mail.module';
import { LythuyetModule } from 'src/csvc/lythuyet/lythuyet.module';
import { HoitruongModule } from 'src/csvc/hoitruong/hoitruong.module';
import { DaphuongtienModule } from 'src/csvc/daphuongtien/daphuongtien.module';
import { ThuchanhModule } from 'src/csvc/thuchanh/thuchanh.module';
import { ThinghiemModule } from 'src/csvc/thinghiem/thinghiem.module';
import { NghiencuuModule } from 'src/csvc/nghiencuu/nghiencuu.module';
import { PgsgsModule } from 'src/csvc/pgsgs/pgsgs.module';
import { NhaxuongModule } from 'src/csvc/nhaxuong/nhaxuong.module';
import { CholamvieccuagvModule } from 'src/csvc/cholamvieccuagv/cholamvieccuagv.module';
import { MaytoantruongModule } from './csvc/maytoantruong/maytoantruong.module';
import { LoaiphongModule } from 'src/csvc/danhmuc/loaiphong/loaiphong.module';
import { PhongchucnangModule } from 'src/csvc/phongchucnang/phongchucnang.module';
import { Tbtren500trModule } from './csvc/tbtren500tr/tbtren500tr.module';
import { DevicesV2Module } from './devices-v2/devices-v2.module';
import { ChungtuModule } from './qlchungtu/chungtu/chungtu.module';
import { NccsModule } from 'src/qlchungtu/ncc/ncc.module';

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
    DatdaiModule,
    ToanhaModule,
    KtxModule,
    ThuvienModule,
    MailModule,
    LythuyetModule,
    HoitruongModule,
    DaphuongtienModule,
    ThuchanhModule,
    ThinghiemModule,
    NghiencuuModule,
    PgsgsModule,
    NhaxuongModule,
    CholamvieccuagvModule,
    MaytoantruongModule,
    LoaiphongModule,
    PhongchucnangModule,
    Tbtren500trModule,
    DevicesV2Module,
    ChungtuModule,
    NccsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
