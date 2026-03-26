import { Injectable } from '@nestjs/common';
import { CreateLoaideanDto } from './dto/create-loaidean.dto';
import { UpdateLoaideanDto } from './dto/update-loaidean.dto';
import { isEmpty } from 'class-validator';
import { InjectModel } from '@nestjs/mongoose';
import { Loaidean } from 'src/csvc/danhmuc/loaidean/schemas/loaidean.schema';
import { Model } from 'mongoose';
import aqp from 'api-query-params';

@Injectable()
export class LoaideanService {
  constructor(@InjectModel(Loaidean.name) private loaideanModel: Model<Loaidean>) { }

  async create(createLoaideanDto: CreateLoaideanDto) {
    return await this.loaideanModel.create({
      ...createLoaideanDto
    })
  }

  async createMany(createLoaideanDto: CreateLoaideanDto[]) {
    return await this.loaideanModel.insertMany(createLoaideanDto);
  }

  async findAll(current: number, pageSize: number, queryString: string) {
    let { filter, population } = aqp(queryString)
    let { sort }: { sort: any } = aqp(queryString)
    delete filter.current
    delete filter.pageSize
    let defaultLimit = +pageSize ? +pageSize : 10
    let defaultCurrent = +current ? +current : 1
    let offset = (+defaultCurrent - 1) * (+defaultLimit)
    const totalItems = await this.loaideanModel.countDocuments(filter)
    const totalPages = Math.ceil(totalItems / defaultLimit)
    if (isEmpty(sort)) {
      sort = "name"
    }
    let units = await this.loaideanModel.find(filter)
      .skip(offset)
      .limit(defaultLimit)
      .sort(sort)
      .populate(population)
      .exec()
    return {
      meta: {
        current: defaultCurrent, //trang hiện tại
        pageSize: defaultLimit, //số lượng bản ghi đã lấy
        pages: totalPages, //tổng số trang với điều kiện query
        total: totalItems // tổng số phần tử (số bản ghi)
      },
      result: units
    }
  }

  async findOne(id: string) {
    return await this.loaideanModel.findOne({ _id: id });
  }

  async update(id: string, updateLoaideanDto: UpdateLoaideanDto) {
    return await this.loaideanModel.updateOne({ _id: id }, updateLoaideanDto);
  }

  async remove(id: string) {
    // throw new Error('Method not implemented.');
    return await this.loaideanModel.deleteOne({ _id: id });
  }

  async removeMany(ids: any[]) {
    return await this.loaideanModel.deleteMany({ _id: { $in: ids } });
  }
}
