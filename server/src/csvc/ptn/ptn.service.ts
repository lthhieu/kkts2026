import { Injectable } from '@nestjs/common';
import { CreatePtnDto } from './dto/create-ptn.dto';
import { UpdatePtnDto } from './dto/update-ptn.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Ptn } from './schemas/ptn.schema';
import { Model } from 'mongoose';
import aqp from 'api-query-params';
import { isEmpty } from 'class-validator';

@Injectable()
export class PtnService {
  constructor(@InjectModel(Ptn.name) private ptnModel: Model<Ptn>) { }

  async create(createPtnDto: CreatePtnDto) {
    return await this.ptnModel.create({ ...createPtnDto });
  }

  async createMany(createPtnDto: CreatePtnDto[]) {
    return await this.ptnModel.insertMany(createPtnDto);
  }

  async findAll(current: number, pageSize: number, queryString: string) {
    let { filter, population } = aqp(queryString);
    let { sort }: { sort: any } = aqp(queryString);
    delete filter.current;
    delete filter.pageSize;
    let defaultLimit = +pageSize ? +pageSize : 10;
    let defaultCurrent = +current ? +current : 1;
    let offset = (defaultCurrent - 1) * defaultLimit;
    const totalItems = await this.ptnModel.countDocuments(filter);
    const totalPages = Math.ceil(totalItems / defaultLimit);
    if (isEmpty(sort)) {
      sort = '-createdAt';
    }
    const result = await this.ptnModel
      .find(filter)
      .skip(offset)
      .limit(defaultLimit)
      .sort(sort)
      .populate(population)
      .populate({ path: 'ma_ct_csvc', select: 'ten_ct' })
      .populate({ path: 'loai_ptn', select: 'name' })
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
    return await this.ptnModel
      .findOne({ _id: id })
      .populate({ path: 'ma_ct_csvc', select: 'ten_ct' })
      .populate({ path: 'loai_ptn', select: 'name' })
      .populate({ path: 'phuc_vu_nganh', select: 'name' })
  }

  async update(id: string, updatePtnDto: UpdatePtnDto) {
    return await this.ptnModel.updateOne({ _id: id }, updatePtnDto);
  }

  async remove(id: string) {
    return await this.ptnModel.deleteOne({ _id: id });
  }

  async removeMany(ids: any[]) {
    return await this.ptnModel.deleteMany({ _id: { $in: ids } });
  }
}
