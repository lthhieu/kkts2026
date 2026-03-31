import { Injectable } from '@nestjs/common';
import { CreateThuvienDto } from './dto/create-thuvien.dto';
import { UpdateThuvienDto } from './dto/update-thuvien.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Thuvien } from './schemas/thuvien.schema';
import { Model } from 'mongoose';
import aqp from 'api-query-params';
import { isEmpty } from 'class-validator';

@Injectable()
export class ThuvienService {
  constructor(@InjectModel(Thuvien.name) private thuvienModel: Model<Thuvien>) { }

  async create(createThuvienDto: CreateThuvienDto) {
    return await this.thuvienModel.create({ ...createThuvienDto });
  }

  async createMany(createThuvienDto: CreateThuvienDto[]) {
    return await this.thuvienModel.insertMany(createThuvienDto);
  }

  async findAll(current: number, pageSize: number, queryString: string) {
    let { filter, population } = aqp(queryString);
    let { sort }: { sort: any } = aqp(queryString);
    delete filter.current;
    delete filter.pageSize;
    let defaultLimit = +pageSize ? +pageSize : 10;
    let defaultCurrent = +current ? +current : 1;
    let offset = (defaultCurrent - 1) * defaultLimit;
    const totalItems = await this.thuvienModel.countDocuments(filter);
    const totalPages = Math.ceil(totalItems / defaultLimit);
    if (isEmpty(sort)) {
      sort = '-createdAt';
    }
    const result = await this.thuvienModel
      .find(filter)
      .skip(offset)
      .limit(defaultLimit)
      .sort(sort)
      .populate(population)
      .exec();
    return {
      meta: {
        current: defaultCurrent,
        pageSize: defaultLimit,
        pages: totalPages,
        total: totalItems,
      },
      result,
    };
  }

  async findOne(id: string) {
    return await this.thuvienModel
      .findOne({ _id: id })
      .populate(['tinhtrangcsvc', 'htsh']);
  }

  async update(id: string, updateThuvienDto: UpdateThuvienDto) {
    return await this.thuvienModel.updateOne({ _id: id }, updateThuvienDto);
  }

  async remove(id: string) {
    return await this.thuvienModel.deleteOne({ _id: id });
  }

  async removeMany(ids: any[]) {
    return await this.thuvienModel.deleteMany({ _id: { $in: ids } });
  }
}
