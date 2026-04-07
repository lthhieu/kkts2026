import { Injectable } from '@nestjs/common';
import { CreateXthDto } from './dto/create-xth.dto';
import { UpdateXthDto } from './dto/update-xth.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Xth } from './schemas/xth.schema';
import { Model } from 'mongoose';
import aqp from 'api-query-params';
import { isEmpty } from 'class-validator';

@Injectable()
export class XthService {
  constructor(@InjectModel(Xth.name) private xthModel: Model<Xth>) { }

  async create(createXthDto: CreateXthDto) {
    return await this.xthModel.create({ ...createXthDto });
  }

  async createMany(createXthDto: CreateXthDto[]) {
    return await this.xthModel.insertMany(createXthDto);
  }

  async findAll(current: number, pageSize: number, queryString: string) {
    let { filter, population } = aqp(queryString);
    let { sort }: { sort: any } = aqp(queryString);
    delete filter.current;
    delete filter.pageSize;
    let defaultLimit = +pageSize ? +pageSize : 10;
    let defaultCurrent = +current ? +current : 1;
    let offset = (defaultCurrent - 1) * defaultLimit;
    const totalItems = await this.xthModel.countDocuments(filter);
    const totalPages = Math.ceil(totalItems / defaultLimit);
    if (isEmpty(sort)) {
      sort = '-createdAt';
    }
    const result = await this.xthModel
      .find(filter)
      .skip(offset)
      .limit(defaultLimit)
      .sort(sort)
      .populate(population)
      .populate({ path: 'ma_ct_csvc', select: 'ten_ct' })
      .populate({ path: 'phuc_vu_nganh', select: 'name' })
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
    return await this.xthModel
      .findOne({ _id: id })
      .populate({ path: 'ma_ct_csvc', select: 'ten_ct' })
      .populate({ path: 'phuc_vu_nganh', select: 'name' })
  }

  async update(id: string, updateXthDto: UpdateXthDto) {
    return await this.xthModel.updateOne({ _id: id }, updateXthDto);
  }

  async remove(id: string) {
    return await this.xthModel.deleteOne({ _id: id });
  }

  async removeMany(ids: any[]) {
    return await this.xthModel.deleteMany({ _id: { $in: ids } });
  }
}
