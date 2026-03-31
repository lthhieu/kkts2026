import { Injectable } from '@nestjs/common';
import { CreateCtkDto } from './dto/create-ctk.dto';
import { UpdateCtkDto } from './dto/update-ctk.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Ctk } from './schemas/ctk.schema';
import { Model } from 'mongoose';
import aqp from 'api-query-params';
import { isEmpty } from 'class-validator';

@Injectable()
export class CtkService {
  constructor(@InjectModel(Ctk.name) private ctkModel: Model<Ctk>) { }

  async create(createCtkDto: CreateCtkDto) {
    return await this.ctkModel.create({ ...createCtkDto });
  }

  async createMany(createCtkDto: CreateCtkDto[]) {
    return await this.ctkModel.insertMany(createCtkDto);
  }

  async findAll(current: number, pageSize: number, queryString: string) {
    let { filter, population } = aqp(queryString);
    let { sort }: { sort: any } = aqp(queryString);
    delete filter.current;
    delete filter.pageSize;
    let defaultLimit = +pageSize ? +pageSize : 10;
    let defaultCurrent = +current ? +current : 1;
    let offset = (defaultCurrent - 1) * defaultLimit;
    const totalItems = await this.ctkModel.countDocuments(filter);
    const totalPages = Math.ceil(totalItems / defaultLimit);
    if (isEmpty(sort)) {
      sort = '-createdAt';
    }
    const result = await this.ctkModel
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
    return await this.ctkModel
      .findOne({ _id: id })
      .populate(['loaicongtrinhcsvc', 'mucdichsudungcsvc', 'tinhtrangcsvc', 'htsh', 'ct_csvc_trongnha']);
  }

  async update(id: string, updateCtkDto: UpdateCtkDto) {
    return await this.ctkModel.updateOne({ _id: id }, updateCtkDto);
  }

  async remove(id: string) {
    return await this.ctkModel.deleteOne({ _id: id });
  }

  async removeMany(ids: any[]) {
    return await this.ctkModel.deleteMany({ _id: { $in: ids } });
  }
}
