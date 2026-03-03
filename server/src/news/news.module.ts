import { Module } from '@nestjs/common';
import { NewsService } from './news.service';
import { NewsController } from './news.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { News, NewsSchema } from 'src/news/schemas/news.schema';
import { CaslModule } from 'src/casl/casl.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: News.name, schema: NewsSchema }]), CaslModule],
  controllers: [NewsController],
  providers: [NewsService],
})
export class NewsModule { }
