import { Injectable } from '@nestjs/common';
import { CreateKtxDto } from './dto/create-ktx.dto';
import { UpdateKtxDto } from './dto/update-ktx.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Ktx } from './schemas/ktx.schema';
import { Model } from 'mongoose';
import aqp from 'api-query-params';
import { isEmpty } from 'class-validator';

@Injectable()
export class KtxService {
  constructor(@InjectModel(Ktx.name) private ktxModel: Model<Ktx>) { }

  async create(createKtxDto: CreateKtxDto) {
    return await this.ktxModel.create({ ...createKtxDto });
  }

  async createMany(createKtxDto: CreateKtxDto[]) {
    return await this.ktxModel.insertMany(createKtxDto);
  }

  async findAll(current: number, pageSize: number, queryString: string) {
    let { filter, population } = aqp(queryString);
    let { sort }: { sort: any } = aqp(queryString);
    delete filter.current;
    delete filter.pageSize;
    let defaultLimit = +pageSize ? +pageSize : 10;
    let defaultCurrent = +current ? +current : 1;
    let offset = (defaultCurrent - 1) * defaultLimit;
    const totalItems = await this.ktxModel.countDocuments(filter);
    const totalPages = Math.ceil(totalItems / defaultLimit);
    if (isEmpty(sort)) {
      sort = '-createdAt';
    }
    const result = await this.ktxModel
      .find(filter)
      .skip(offset)
      .limit(defaultLimit)
      .sort(sort)
      .populate(population)
      .populate({ path: 'htsh', select: 'name' })
      .populate({ path: 'tinhtrangcsvc', select: 'name' })
      .populate({ path: 'tinh_trang_sd', select: 'name' })
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
    return await this.ktxModel
      .findOne({ _id: id })
      .populate({ path: 'htsh', select: 'name' })
      .populate({ path: 'tinhtrangcsvc', select: 'name' })
      .populate({ path: 'tinh_trang_sd', select: 'name' })
  }

  async update(id: string, updateKtxDto: UpdateKtxDto) {
    return await this.ktxModel.updateOne({ _id: id }, updateKtxDto);
  }

  async remove(id: string) {
    return await this.ktxModel.deleteOne({ _id: id });
  }

  async removeMany(ids: any[]) {
    return await this.ktxModel.deleteMany({ _id: { $in: ids } });
  }
}
