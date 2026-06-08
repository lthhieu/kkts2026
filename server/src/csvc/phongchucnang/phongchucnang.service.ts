import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import aqp from 'api-query-params';
import { isEmpty } from 'class-validator';
import { Phongchucnang } from 'src/csvc/phongchucnang/schemas/phongchucnang.schema';
import { CreatePhongchucnangDto } from 'src/csvc/phongchucnang/dto/create-phongchucnang.dto';
import { UpdatePhongchucnangDto } from 'src/csvc/phongchucnang/dto/update-phongchucnang.dto';

@Injectable()
export class PhongchucnangService {
  constructor(@InjectModel(Phongchucnang.name) private phongchucnangModel: Model<Phongchucnang>) { }

  async create(createPhongchucnangDto: CreatePhongchucnangDto) {
    return await this.phongchucnangModel.create({ ...createPhongchucnangDto });
  }

  async createMany(createPhongchucnangDto: CreatePhongchucnangDto[]) {
    return await this.phongchucnangModel.insertMany(createPhongchucnangDto);
  }

  async summary() {
    const result = await this.phongchucnangModel.aggregate([
      {
        $group: {
          _id: null,
          totalDT: {
            $sum: '$dtxd',
          },
        },
      },

      {
        $project: {
          totalDT: 1,
        },
      },
    ]);

    return result;
  }

  async findAll(current: number, pageSize: number, queryString: string) {
    let { filter, population } = aqp(queryString);
    let { sort }: { sort: any } = aqp(queryString);
    delete filter.current;
    delete filter.pageSize;
    let defaultLimit = +pageSize ? +pageSize : 10;
    let defaultCurrent = +current ? +current : 1;
    let offset = (defaultCurrent - 1) * defaultLimit;
    const totalItems = await this.phongchucnangModel.countDocuments(filter);
    const totalPages = Math.ceil(totalItems / defaultLimit);
    if (isEmpty(sort)) {
      sort = 'ma';
    }
    const result = await this.phongchucnangModel
      .find(filter)
      .skip(offset)
      .limit(defaultLimit)
      .sort(sort)
      .populate(population)
      .populate({ path: 'type', select: 'name' })
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
    return await this.phongchucnangModel
      .findOne({ _id: id }).populate({ path: 'type', select: 'name' })
  }

  async update(id: string, updatePhongchucnangDto: UpdatePhongchucnangDto) {
    return await this.phongchucnangModel.updateOne({ _id: id }, updatePhongchucnangDto);
  }

  async remove(id: string) {
    return await this.phongchucnangModel.deleteOne({ _id: id });
  }

  async removeMany(ids: any[]) {
    return await this.phongchucnangModel.deleteMany({ _id: { $in: ids } });
  }

  async exportAll() {
    return await this.phongchucnangModel.find()
      .populate({ path: 'type', select: 'name' }).lean();
  }
}
