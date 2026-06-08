import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import aqp from 'api-query-params';
import { isEmpty } from 'class-validator';
import { Hoitruong } from 'src/csvc/hoitruong/schemas/hoitruong.schema';
import { CreateHoitruongDto } from 'src/csvc/hoitruong/dto/create-hoitruong.dto';
import { UpdateHoitruongDto } from 'src/csvc/hoitruong/dto/update-hoitruong.dto';

@Injectable()
export class HoitruongService {
  constructor(@InjectModel(Hoitruong.name) private hoitruongModel: Model<Hoitruong>) { }

  async create(createHoitruongDto: CreateHoitruongDto) {
    return await this.hoitruongModel.create({ ...createHoitruongDto });
  }

  async createMany(createHoitruongDto: CreateHoitruongDto[]) {
    return await this.hoitruongModel.insertMany(createHoitruongDto);
  }

  async summary() {
    const result = await this.hoitruongModel.aggregate([
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
    const totalItems = await this.hoitruongModel.countDocuments(filter);
    const totalPages = Math.ceil(totalItems / defaultLimit);
    if (isEmpty(sort)) {
      sort = '-createdAt';
    }
    const result = await this.hoitruongModel
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
    return await this.hoitruongModel
      .findOne({ _id: id })
  }

  async update(id: string, updateHoitruongDto: UpdateHoitruongDto) {
    return await this.hoitruongModel.updateOne({ _id: id }, updateHoitruongDto);
  }

  async remove(id: string) {
    return await this.hoitruongModel.deleteOne({ _id: id });
  }

  async removeMany(ids: any[]) {
    return await this.hoitruongModel.deleteMany({ _id: { $in: ids } });
  }

  async exportAll() {
    return await this.hoitruongModel.find().lean();
  }
}
