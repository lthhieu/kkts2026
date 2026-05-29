import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import aqp from 'api-query-params';
import { isEmpty } from 'class-validator';
import { Nhaxuong } from 'src/csvc/nhaxuong/schemas/nhaxuong.schema';
import { CreateNhaxuongDto } from 'src/csvc/nhaxuong/dto/create-nhaxuong.dto';
import { UpdateNhaxuongDto } from 'src/csvc/nhaxuong/dto/update-nhaxuong.dto';

@Injectable()
export class NhaxuongService {
  constructor(@InjectModel(Nhaxuong.name) private nhaxuongModel: Model<Nhaxuong>) { }

  async create(createNhaxuongDto: CreateNhaxuongDto) {
    return await this.nhaxuongModel.create({ ...createNhaxuongDto });
  }

  async createMany(createNhaxuongDto: CreateNhaxuongDto[]) {
    return await this.nhaxuongModel.insertMany(createNhaxuongDto);
  }

  async summary() {
    const result = await this.nhaxuongModel.aggregate([
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
    const totalItems = await this.nhaxuongModel.countDocuments(filter);
    const totalPages = Math.ceil(totalItems / defaultLimit);
    if (isEmpty(sort)) {
      sort = '-createdAt';
    }
    const result = await this.nhaxuongModel
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
    return await this.nhaxuongModel
      .findOne({ _id: id })
  }

  async update(id: string, updateNhaxuongDto: UpdateNhaxuongDto) {
    return await this.nhaxuongModel.updateOne({ _id: id }, updateNhaxuongDto);
  }

  async remove(id: string) {
    return await this.nhaxuongModel.deleteOne({ _id: id });
  }

  async removeMany(ids: any[]) {
    return await this.nhaxuongModel.deleteMany({ _id: { $in: ids } });
  }
}
