import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import aqp from 'api-query-params';
import { isEmpty } from 'class-validator';
import { Pgsgs } from 'src/csvc/pgsgs/schemas/pgsgs.schema';
import { CreatePgsgsDto } from 'src/csvc/pgsgs/dto/create-pgsgs.dto';
import { UpdatePgsgsDto } from 'src/csvc/pgsgs/dto/update-pgsgs.dto';

@Injectable()
export class PgsgsService {
  constructor(@InjectModel(Pgsgs.name) private pgsgsModel: Model<Pgsgs>) { }

  async create(createPgsgsDto: CreatePgsgsDto) {
    return await this.pgsgsModel.create({ ...createPgsgsDto });
  }

  async createMany(createPgsgsDto: CreatePgsgsDto[]) {
    return await this.pgsgsModel.insertMany(createPgsgsDto);
  }

  async summary() {
    const result = await this.pgsgsModel.aggregate([
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
    const totalItems = await this.pgsgsModel.countDocuments(filter);
    const totalPages = Math.ceil(totalItems / defaultLimit);
    if (isEmpty(sort)) {
      sort = '-createdAt';
    }
    const result = await this.pgsgsModel
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
    return await this.pgsgsModel
      .findOne({ _id: id })
  }

  async update(id: string, updatePgsgsDto: UpdatePgsgsDto) {
    return await this.pgsgsModel.updateOne({ _id: id }, updatePgsgsDto);
  }

  async remove(id: string) {
    return await this.pgsgsModel.deleteOne({ _id: id });
  }

  async removeMany(ids: any[]) {
    return await this.pgsgsModel.deleteMany({ _id: { $in: ids } });
  }
  async exportAll() {
    return await this.pgsgsModel.find().lean();
  }
}
