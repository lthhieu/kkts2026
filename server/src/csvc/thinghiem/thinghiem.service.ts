import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import aqp from 'api-query-params';
import { isEmpty } from 'class-validator';
import { Thinghiem } from 'src/csvc/thinghiem/schemas/thignhiem.schema';
import { CreateThinghiemDto } from 'src/csvc/thinghiem/dto/create-thinghiem.dto';
import { UpdateThinghiemDto } from 'src/csvc/thinghiem/dto/update-thinghiem.dto';

@Injectable()
export class ThinghiemService {
  constructor(@InjectModel(Thinghiem.name) private thinghiemModel: Model<Thinghiem>) { }

  async create(createThinghiemDto: CreateThinghiemDto) {
    return await this.thinghiemModel.create({ ...createThinghiemDto });
  }

  async createMany(createThinghiemDto: CreateThinghiemDto[]) {
    return await this.thinghiemModel.insertMany(createThinghiemDto);
  }

  async summary() {
    const result = await this.thinghiemModel.aggregate([
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
    const totalItems = await this.thinghiemModel.countDocuments(filter);
    const totalPages = Math.ceil(totalItems / defaultLimit);
    if (isEmpty(sort)) {
      sort = '-createdAt';
    }
    const result = await this.thinghiemModel
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
    return await this.thinghiemModel
      .findOne({ _id: id })
  }

  async update(id: string, updateThinghiemDto: UpdateThinghiemDto) {
    return await this.thinghiemModel.updateOne({ _id: id }, updateThinghiemDto);
  }

  async remove(id: string) {
    return await this.thinghiemModel.deleteOne({ _id: id });
  }

  async removeMany(ids: any[]) {
    return await this.thinghiemModel.deleteMany({ _id: { $in: ids } });
  }

  async exportAll() {
    return await this.thinghiemModel.find().lean();
  }
}
