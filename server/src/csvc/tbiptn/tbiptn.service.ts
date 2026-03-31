import { Injectable } from '@nestjs/common';
import { CreateTbiptnDto } from './dto/create-tbiptn.dto';
import { UpdateTbiptnDto } from './dto/update-tbiptn.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Tbiptn } from './schemas/tbiptn.schema';
import { Model } from 'mongoose';
import aqp from 'api-query-params';
import { isEmpty } from 'class-validator';

@Injectable()
export class TbiptnService {
  constructor(@InjectModel(Tbiptn.name) private tbiptnModel: Model<Tbiptn>) { }

  async create(createTbiptnDto: CreateTbiptnDto) {
    return await this.tbiptnModel.create({ ...createTbiptnDto });
  }

  async createMany(createTbiptnDto: CreateTbiptnDto[]) {
    return await this.tbiptnModel.insertMany(createTbiptnDto);
  }

  async findAll(current: number, pageSize: number, queryString: string) {
    let { filter, population } = aqp(queryString);
    let { sort }: { sort: any } = aqp(queryString);
    delete filter.current;
    delete filter.pageSize;
    let defaultLimit = +pageSize ? +pageSize : 10;
    let defaultCurrent = +current ? +current : 1;
    let offset = (defaultCurrent - 1) * defaultLimit;
    const totalItems = await this.tbiptnModel.countDocuments(filter);
    const totalPages = Math.ceil(totalItems / defaultLimit);
    if (isEmpty(sort)) {
      sort = '-createdAt';
    }
    const result = await this.tbiptnModel
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
    return await this.tbiptnModel
      .findOne({ _id: id })
      .populate(['ma_ct_csvc']);
  }

  async update(id: string, updateTbiptnDto: UpdateTbiptnDto) {
    return await this.tbiptnModel.updateOne({ _id: id }, updateTbiptnDto);
  }

  async remove(id: string) {
    return await this.tbiptnModel.deleteOne({ _id: id });
  }

  async removeMany(ids: any[]) {
    return await this.tbiptnModel.deleteMany({ _id: { $in: ids } });
  }
}
