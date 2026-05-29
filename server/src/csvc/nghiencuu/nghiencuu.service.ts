import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import aqp from 'api-query-params';
import { isEmpty } from 'class-validator';
import { Nghiencuu } from 'src/csvc/nghiencuu/schemas/nghiencuu.schema';
import { CreateNghiencuuDto } from 'src/csvc/nghiencuu/dto/create-nghiencuu.dto';
import { UpdateNghiencuuDto } from 'src/csvc/nghiencuu/dto/update-nghiencuu.dto';

@Injectable()
export class NghiencuuService {
  constructor(@InjectModel(Nghiencuu.name) private nghiencuuModel: Model<Nghiencuu>) { }

  async create(createNghiencuuDto: CreateNghiencuuDto) {
    return await this.nghiencuuModel.create({ ...createNghiencuuDto });
  }

  async createMany(createNghiencuuDto: CreateNghiencuuDto[]) {
    return await this.nghiencuuModel.insertMany(createNghiencuuDto);
  }

  async summary() {
    const result = await this.nghiencuuModel.aggregate([
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
    const totalItems = await this.nghiencuuModel.countDocuments(filter);
    const totalPages = Math.ceil(totalItems / defaultLimit);
    if (isEmpty(sort)) {
      sort = '-createdAt';
    }
    const result = await this.nghiencuuModel
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
    return await this.nghiencuuModel
      .findOne({ _id: id })
  }

  async update(id: string, updateNghiencuuDto: UpdateNghiencuuDto) {
    return await this.nghiencuuModel.updateOne({ _id: id }, updateNghiencuuDto);
  }

  async remove(id: string) {
    return await this.nghiencuuModel.deleteOne({ _id: id });
  }

  async removeMany(ids: any[]) {
    return await this.nghiencuuModel.deleteMany({ _id: { $in: ids } });
  }
}
