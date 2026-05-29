import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import aqp from 'api-query-params';
import { isEmpty } from 'class-validator';
import { Daphuongtien } from 'src/csvc/daphuongtien/schemas/daphuongtien.schema';
import { CreateDaphuongtienDto } from 'src/csvc/daphuongtien/dto/create-daphuongtien.dto';
import { UpdateDaphuongtienDto } from 'src/csvc/daphuongtien/dto/update-daphuongtien.dto';

@Injectable()
export class DaphuongtienService {
  constructor(@InjectModel(Daphuongtien.name) private daphuongtienModel: Model<Daphuongtien>) { }

  async create(createDaphuongtienDto: CreateDaphuongtienDto) {
    return await this.daphuongtienModel.create({ ...createDaphuongtienDto });
  }

  async createMany(createDaphuongtienDto: CreateDaphuongtienDto[]) {
    return await this.daphuongtienModel.insertMany(createDaphuongtienDto);
  }

  async summary() {
    const result = await this.daphuongtienModel.aggregate([
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
    const totalItems = await this.daphuongtienModel.countDocuments(filter);
    const totalPages = Math.ceil(totalItems / defaultLimit);
    if (isEmpty(sort)) {
      sort = '-createdAt';
    }
    const result = await this.daphuongtienModel
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
    return await this.daphuongtienModel
      .findOne({ _id: id })
  }

  async update(id: string, updateDaphuongtienDto: UpdateDaphuongtienDto) {
    return await this.daphuongtienModel.updateOne({ _id: id }, updateDaphuongtienDto);
  }

  async remove(id: string) {
    return await this.daphuongtienModel.deleteOne({ _id: id });
  }

  async removeMany(ids: any[]) {
    return await this.daphuongtienModel.deleteMany({ _id: { $in: ids } });
  }
}
