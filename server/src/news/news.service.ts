import { Injectable } from '@nestjs/common';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import { InjectModel } from '@nestjs/mongoose';
import { News } from 'src/news/schemas/news.schema';
import { Model } from 'mongoose';
import { isEmpty } from 'class-validator';
import aqp from 'api-query-params';

@Injectable()
export class NewsService {
  constructor(@InjectModel(News.name) private newsModel: Model<News>) { }

  async create(createNewsDto: CreateNewsDto, user: IUser) {
    return await this.newsModel.create({
      ...createNewsDto,
      author: user._id as any
    })
  }

  async findAll(current: number, pageSize: number, queryString: string) {
    let { filter, population } = aqp(queryString)
    let { sort }: { sort: any } = aqp(queryString)
    delete filter.current
    delete filter.pageSize
    let defaultLimit = +pageSize ? +pageSize : 10
    let defaultCurrent = +current ? +current : 1
    let offset = (+defaultCurrent - 1) * (+defaultLimit)
    const totalItems = await this.newsModel.countDocuments(filter)
    const totalPages = Math.ceil(totalItems / defaultLimit)
    if (isEmpty(sort)) {
      sort = "-createdAt"
    }
    let units = await this.newsModel.find(filter)
      .skip(offset)
      .limit(defaultLimit)
      .sort(sort)
      .populate(population)
      .populate({ path: 'author', select: 'name' })
      .exec()
    return {
      meta: {
        current: defaultCurrent, //trang hiện tại
        pageSize: defaultLimit, //số lượng bản ghi đã lấy
        pages: totalPages, //tổng số trang với điều kiện query
        total: totalItems // tổng số phần tử (số bản ghi)
      },
      result: units
    }
  }

  async findOne(slug: string) {
    return await this.newsModel.findOne({ slug })
      .populate({ path: 'author', select: 'name' });
  }

  async update(id: string, updateNewsDto: UpdateNewsDto) {
    return await this.newsModel.updateOne({ _id: id }, updateNewsDto);
  }

  async remove(id: string) {
    // throw new Error('Method not implemented.');
    return await this.newsModel.deleteOne({ _id: id });
  }

  async removeMany(ids: any[]) {
    return await this.newsModel.deleteMany({ _id: { $in: ids } });
  }
}
