import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import aqp from 'api-query-params';
import { isEmpty } from 'class-validator';
import { Thuchanh } from 'src/csvc/thuchanh/schemas/thuchanh.schema';
import { CreateThuchanhDto } from 'src/csvc/thuchanh/dto/create-thuchanh.dto';
import { UpdateThuchanhDto } from 'src/csvc/thuchanh/dto/update-thuchanh.dto';

@Injectable()
export class ThuchanhService {
  constructor(@InjectModel(Thuchanh.name) private thuchanhModel: Model<Thuchanh>) { }

  async create(createThuchanhDto: CreateThuchanhDto) {
    return await this.thuchanhModel.create({ ...createThuchanhDto });
  }

  async createMany(createThuchanhDto: CreateThuchanhDto[]) {
    return await this.thuchanhModel.insertMany(createThuchanhDto);
  }

  async summary() {
    const result = await this.thuchanhModel.aggregate([
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
    const totalItems = await this.thuchanhModel.countDocuments(filter);
    const totalPages = Math.ceil(totalItems / defaultLimit);
    if (isEmpty(sort)) {
      sort = '-createdAt';
    }
    const result = await this.thuchanhModel
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
    return await this.thuchanhModel
      .findOne({ _id: id })
  }

  async update(id: string, updateThuchanhDto: UpdateThuchanhDto) {
    return await this.thuchanhModel.updateOne({ _id: id }, updateThuchanhDto);
  }

  async remove(id: string) {
    return await this.thuchanhModel.deleteOne({ _id: id });
  }

  async removeMany(ids: any[]) {
    return await this.thuchanhModel.deleteMany({ _id: { $in: ids } });
  }
}
