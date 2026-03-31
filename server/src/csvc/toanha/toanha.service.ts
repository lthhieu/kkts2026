import { Injectable } from '@nestjs/common';
import { CreateToanhaDto } from './dto/create-toanha.dto';
import { UpdateToanhaDto } from './dto/update-toanha.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Toanha } from './schemas/toanha.schema';
import { Model } from 'mongoose';
import aqp from 'api-query-params';
import { isEmpty } from 'class-validator';

@Injectable()
export class ToanhaService {
  constructor(@InjectModel(Toanha.name) private toanhaModel: Model<Toanha>) { }

  async create(createToanhaDto: CreateToanhaDto) {
    return await this.toanhaModel.create({ ...createToanhaDto });
  }

  async createMany(createToanhaDto: CreateToanhaDto[]) {
    return await this.toanhaModel.insertMany(createToanhaDto);
  }

  async findAll(current: number, pageSize: number, queryString: string) {
    let { filter, population } = aqp(queryString);
    let { sort }: { sort: any } = aqp(queryString);
    delete filter.current;
    delete filter.pageSize;
    let defaultLimit = +pageSize ? +pageSize : 10;
    let defaultCurrent = +current ? +current : 1;
    let offset = (defaultCurrent - 1) * defaultLimit;
    const totalItems = await this.toanhaModel.countDocuments(filter);
    const totalPages = Math.ceil(totalItems / defaultLimit);
    if (isEmpty(sort)) {
      sort = '-createdAt';
    }
    const result = await this.toanhaModel
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
    return await this.toanhaModel
      .findOne({ _id: id })
      .populate(['htsh', 'tinh_trang_sd']);
  }

  async update(id: string, updateToanhaDto: UpdateToanhaDto) {
    return await this.toanhaModel.updateOne({ _id: id }, updateToanhaDto);
  }

  async remove(id: string) {
    return await this.toanhaModel.deleteOne({ _id: id });
  }

  async removeMany(ids: any[]) {
    return await this.toanhaModel.deleteMany({ _id: { $in: ids } });
  }
}
