import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import aqp from 'api-query-params';
import { isEmpty } from 'class-validator';
import { Cholamvieccuagv } from 'src/csvc/cholamvieccuagv/schemas/cholamvieccuagv.schema';
import { CreateCholamvieccuagvDto } from 'src/csvc/cholamvieccuagv/dto/create-cholamvieccuagv.dto';
import { UpdateCholamvieccuagvDto } from 'src/csvc/cholamvieccuagv/dto/update-cholamvieccuagv.dto';

@Injectable()
export class CholamvieccuagvService {
  constructor(@InjectModel(Cholamvieccuagv.name) private cholamvieccuagvModel: Model<Cholamvieccuagv>) { }

  async create(createCholamvieccuagvDto: CreateCholamvieccuagvDto) {
    return await this.cholamvieccuagvModel.create({ ...createCholamvieccuagvDto });
  }

  async createMany(createCholamvieccuagvDto: CreateCholamvieccuagvDto[]) {
    return await this.cholamvieccuagvModel.insertMany(createCholamvieccuagvDto);
  }

  async summary() {
    const result = await this.cholamvieccuagvModel.aggregate([
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
    const totalItems = await this.cholamvieccuagvModel.countDocuments(filter);
    const totalPages = Math.ceil(totalItems / defaultLimit);
    if (isEmpty(sort)) {
      sort = '-createdAt';
    }
    const result = await this.cholamvieccuagvModel
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
    return await this.cholamvieccuagvModel
      .findOne({ _id: id })
  }

  async update(id: string, updateCholamvieccuagvDto: UpdateCholamvieccuagvDto) {
    return await this.cholamvieccuagvModel.updateOne({ _id: id }, updateCholamvieccuagvDto);
  }

  async remove(id: string) {
    return await this.cholamvieccuagvModel.deleteOne({ _id: id });
  }

  async removeMany(ids: any[]) {
    return await this.cholamvieccuagvModel.deleteMany({ _id: { $in: ids } });
  }
}
