import { Injectable } from '@nestjs/common';
import { CreateLoaicongtrinhcsvcDto } from './dto/create-loaicongtrinhcsvc.dto';
import { UpdateLoaicongtrinhcsvcDto } from './dto/update-loaicongtrinhcsvc.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Loaicongtrinhcsvc } from 'src/csvc/danhmuc/loaicongtrinhcsvc/schemas/loaicongtrinhcsvc.schema';
import { Model } from 'mongoose';
import aqp from 'api-query-params';
import { isEmpty } from 'class-validator';

@Injectable()
export class LoaicongtrinhcsvcService {
  constructor(@InjectModel(Loaicongtrinhcsvc.name) private loaicongtrinhcsvcModel: Model<Loaicongtrinhcsvc>) { }

  async create(createLoaicongtrinhcsvcDto: CreateLoaicongtrinhcsvcDto) {
    return await this.loaicongtrinhcsvcModel.create({
      ...createLoaicongtrinhcsvcDto
    })
  }

  async createMany(createLoaicongtrinhcsvcDto: CreateLoaicongtrinhcsvcDto[]) {
    return await this.loaicongtrinhcsvcModel.insertMany(createLoaicongtrinhcsvcDto);
  }

  async findAll(current: number, pageSize: number, queryString: string) {
    let { filter, population } = aqp(queryString)
    let { sort }: { sort: any } = aqp(queryString)
    delete filter.current
    delete filter.pageSize
    let defaultLimit = +pageSize ? +pageSize : 10
    let defaultCurrent = +current ? +current : 1
    let offset = (+defaultCurrent - 1) * (+defaultLimit)
    const totalItems = await this.loaicongtrinhcsvcModel.countDocuments(filter)
    const totalPages = Math.ceil(totalItems / defaultLimit)
    if (isEmpty(sort)) {
      sort = "name"
    }
    let res = await this.loaicongtrinhcsvcModel.find(filter)
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
      result: res
    }
  }

  async findOne(id: string) {
    return await this.loaicongtrinhcsvcModel.findOne({ _id: id });
  }

  async update(id: string, updateLoaicongtrinhcsvcDto: UpdateLoaicongtrinhcsvcDto) {
    return await this.loaicongtrinhcsvcModel.updateOne({ _id: id }, updateLoaicongtrinhcsvcDto);
  }

  async remove(id: string) {
    // throw new Error('Method not implemented.');
    return await this.loaicongtrinhcsvcModel.deleteOne({ _id: id });
  }

  async removeMany(ids: any[]) {
    return await this.loaicongtrinhcsvcModel.deleteMany({ _id: { $in: ids } });
  }
}
