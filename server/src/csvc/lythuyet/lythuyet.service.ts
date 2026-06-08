import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import aqp from 'api-query-params';
import { isEmpty } from 'class-validator';
import { Lythuyet } from 'src/csvc/lythuyet/schemas/lythuyet.schema';
import { CreateLythuyetDto } from 'src/csvc/lythuyet/dto/create-lythuyet.dto';
import { UpdateLythuyetDto } from 'src/csvc/lythuyet/dto/update-lythuyet.dto';

@Injectable()
export class LythuyetService {
  constructor(@InjectModel(Lythuyet.name) private lythuyetModel: Model<Lythuyet>) { }

  async create(createLythuyetDto: CreateLythuyetDto) {
    return await this.lythuyetModel.create({ ...createLythuyetDto });
  }

  async createMany(createLythuyetDto: CreateLythuyetDto[]) {
    return await this.lythuyetModel.insertMany(createLythuyetDto);
  }

  async summary() {
    const result = await this.lythuyetModel.aggregate([
      {
        $group: {
          _id: null,
          totalDT: {
            $sum: '$dt',
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
    const totalItems = await this.lythuyetModel.countDocuments(filter);
    const totalPages = Math.ceil(totalItems / defaultLimit);
    if (isEmpty(sort)) {
      sort = '-createdAt';
    }
    const result = await this.lythuyetModel
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
    return await this.lythuyetModel
      .findOne({ _id: id })
  }

  async update(id: string, updateLythuyetDto: UpdateLythuyetDto) {
    return await this.lythuyetModel.updateOne({ _id: id }, updateLythuyetDto);
  }

  async remove(id: string) {
    return await this.lythuyetModel.deleteOne({ _id: id });
  }

  async removeMany(ids: any[]) {
    return await this.lythuyetModel.deleteMany({ _id: { $in: ids } });
  }

  async exportAll() {
    return await this.lythuyetModel.find().lean();
  }
}
