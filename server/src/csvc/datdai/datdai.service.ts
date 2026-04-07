import { Injectable } from '@nestjs/common';
import { CreateDatdaiDto } from './dto/create-datdai.dto';
import { UpdateDatdaiDto } from './dto/update-datdai.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Datdai } from './schemas/datdai.schema';
import { Model } from 'mongoose';
import aqp from 'api-query-params';
import { isEmpty } from 'class-validator';

@Injectable()
export class DatdaiService {
  constructor(@InjectModel(Datdai.name) private datdaiModel: Model<Datdai>) { }

  async create(createDatdaiDto: CreateDatdaiDto) {
    return await this.datdaiModel.create({ ...createDatdaiDto });
  }

  async createMany(createDatdaiDto: CreateDatdaiDto[]) {
    return await this.datdaiModel.insertMany(createDatdaiDto);
  }

  async findAll(current: number, pageSize: number, queryString: string) {
    let { filter, population } = aqp(queryString);
    let { sort }: { sort: any } = aqp(queryString);
    delete filter.current;
    delete filter.pageSize;
    let defaultLimit = +pageSize ? +pageSize : 10;
    let defaultCurrent = +current ? +current : 1;
    let offset = (defaultCurrent - 1) * defaultLimit;
    const totalItems = await this.datdaiModel.countDocuments(filter);
    const totalPages = Math.ceil(totalItems / defaultLimit);
    if (isEmpty(sort)) {
      sort = '-createdAt';
    }
    const result = await this.datdaiModel
      .find(filter)
      .skip(offset)
      .limit(defaultLimit)
      .sort(sort)
      .populate(population)
      .populate({ path: 'htsd', select: 'name' })
      .populate({ path: 'muc_dich_shd', select: 'name' })
      .populate({ path: 'tinh_trang_sd', select: 'name' })
      .populate({ path: 'tinhthanhpho', select: 'name' })
      .populate({ path: 'xaphuong', select: 'name' })
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
    return await this.datdaiModel
      .findOne({ _id: id })
      .populate({ path: 'htsd', select: 'name' })
      .populate({ path: 'muc_dich_shd', select: 'name' })
      .populate({ path: 'tinh_trang_sd', select: 'name' })
      .populate({ path: 'tinhthanhpho', select: 'name' })
      .populate({ path: 'xaphuong', select: 'name' })
  }

  async update(id: string, updateDatdaiDto: UpdateDatdaiDto) {
    return await this.datdaiModel.updateOne({ _id: id }, updateDatdaiDto);
  }

  async remove(id: string) {
    return await this.datdaiModel.deleteOne({ _id: id });
  }

  async removeMany(ids: any[]) {
    return await this.datdaiModel.deleteMany({ _id: { $in: ids } });
  }
}
