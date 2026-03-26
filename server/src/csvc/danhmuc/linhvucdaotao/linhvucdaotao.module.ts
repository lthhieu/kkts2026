import { Module } from '@nestjs/common';
import { LinhvucdaotaoService } from './linhvucdaotao.service';
import { LinhvucdaotaoController } from './linhvucdaotao.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Linhvucdaotao, LinhvucdaotaoSchema } from 'src/csvc/danhmuc/linhvucdaotao/schemas/linhvucdaotao.schema';
import { CaslModule } from 'src/casl/casl.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: Linhvucdaotao.name, schema: LinhvucdaotaoSchema }]), CaslModule],
  controllers: [LinhvucdaotaoController],
  providers: [LinhvucdaotaoService],
})
export class LinhvucdaotaoModule { }
