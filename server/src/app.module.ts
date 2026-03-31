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
import { HinhthucsohuuModule } from './csvc/danhmuc/hinhthucsohuu/hinhthucsohuu.module';
import { HinhthucsudungModule } from './csvc/danhmuc/hinhthucsudung/hinhthucsudung.module';
import { TinhtrangsudungModule } from './csvc/danhmuc/tinhtrangsudung/tinhtrangsudung.module';
import { TinhthanhphoModule } from './csvc/danhmuc/tinhthanhpho/tinhthanhpho.module';
import { XaphuongModule } from './csvc/danhmuc/xaphuong/xaphuong.module';
import { ToanhaModule } from './csvc/toanha/toanha.module';
import { PhgdhtModule } from './csvc/phgdht/phgdht.module';
import { TinhtrangcsvcModule } from './csvc/danhmuc/tinhtrangcsvc/tinhtrangcsvc.module';
import { PhanloaiModule } from './csvc/danhmuc/phanloai/phanloai.module';
import { LoaiphonghocModule } from './csvc/danhmuc/loaiphonghoc/loaiphonghoc.module';
import { LoaicongtrinhcsvcModule } from './csvc/danhmuc/loaicongtrinhcsvc/loaicongtrinhcsvc.module';
import { LoaiptnModule } from './csvc/danhmuc/loaiptn/loaiptn.module';
import { CountriesModule } from './csvc/danhmuc/countries/countries.module';
import { MucdichsudungcsvcModule } from './csvc/danhmuc/mucdichsudungcsvc/mucdichsudungcsvc.module';
import { LinhvucdaotaoModule } from './csvc/danhmuc/linhvucdaotao/linhvucdaotao.module';
import { LoaideanModule } from './csvc/danhmuc/loaidean/loaidean.module';
import { MucdichsudungdatModule } from './csvc/danhmuc/mucdichsudungdat/mucdichsudungdat.module';
import { KtxModule } from './csvc/ktx/ktx.module';
import { CtkModule } from './csvc/ctk/ctk.module';
import { LuachonModule } from './csvc/danhmuc/luachon/luachon.module';
import { PtnModule } from './csvc/ptn/ptn.module';
import { XthModule } from './csvc/xth/xth.module';
import { TbiptnModule } from './csvc/tbiptn/tbiptn.module';
import { ThuvienModule } from './csvc/thuvien/thuvien.module';

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
    HinhthucsohuuModule,
    HinhthucsudungModule,
    TinhtrangsudungModule,
    TinhthanhphoModule,
    XaphuongModule,
    ToanhaModule,
    PhgdhtModule,
    TinhtrangcsvcModule,
    PhanloaiModule,
    LoaiphonghocModule,
    LoaicongtrinhcsvcModule,
    LoaiptnModule,
    CountriesModule,
    MucdichsudungcsvcModule,
    LinhvucdaotaoModule,
    LoaideanModule,
    MucdichsudungdatModule,
    KtxModule,
    CtkModule,
    LuachonModule,
    PtnModule,
    XthModule,
    TbiptnModule,
    ThuvienModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
