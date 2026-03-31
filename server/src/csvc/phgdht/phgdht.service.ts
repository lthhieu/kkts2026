import { Injectable } from '@nestjs/common';
import { CreatePhgdhtDto } from './dto/create-phgdht.dto';
import { UpdatePhgdhtDto } from './dto/update-phgdht.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Phgdht } from './schemas/phgdht.schema';
import { Model } from 'mongoose';
import aqp from 'api-query-params';
import { isEmpty } from 'class-validator';

@Injectable()
export class PhgdhtService {
  constructor(@InjectModel(Phgdht.name) private phgdhtModel: Model<Phgdht>) { }

  async create(createPhgdhtDto: CreatePhgdhtDto) {
    return await this.phgdhtModel.create({ ...createPhgdhtDto });
  }

  async createMany(createPhgdhtDto: CreatePhgdhtDto[]) {
    return await this.phgdhtModel.insertMany(createPhgdhtDto);
  }

  async findAll(current: number, pageSize: number, queryString: string) {
    let { filter, population } = aqp(queryString);
    let { sort }: { sort: any } = aqp(queryString);
    delete filter.current;
    delete filter.pageSize;
    let defaultLimit = +pageSize ? +pageSize : 10;
    let defaultCurrent = +current ? +current : 1;
    let offset = (defaultCurrent - 1) * defaultLimit;
    const totalItems = await this.phgdhtModel.countDocuments(filter);
    const totalPages = Math.ceil(totalItems / defaultLimit);
    if (isEmpty(sort)) {
      sort = '-createdAt';
    }
    const result = await this.phgdhtModel
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
    return await this.phgdhtModel
      .findOne({ _id: id })
      .populate(['htsh', 'tinhtrangcsvc', 'phanloai', 'loaiphonghoc', 'loaidean']);
  }

  async update(id: string, updatePhgdhtDto: UpdatePhgdhtDto) {
    return await this.phgdhtModel.updateOne({ _id: id }, updatePhgdhtDto);
  }

  async remove(id: string) {
    return await this.phgdhtModel.deleteOne({ _id: id });
  }

  async removeMany(ids: any[]) {
    return await this.phgdhtModel.deleteMany({ _id: { $in: ids } });
  }
}
