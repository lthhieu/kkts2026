import { Injectable } from '@nestjs/common';
import { CreateLoaiphongDto } from './dto/create-loaiphong.dto';
import { UpdateLoaiphongDto } from './dto/update-loaiphong.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Loaiphong } from 'src/csvc/danhmuc/loaiphong/schemas/loaiphong.schema';
import { Model } from 'mongoose';
import aqp from 'api-query-params';
import { isEmpty } from 'class-validator';

@Injectable()
export class LoaiphongService {
  constructor(@InjectModel(Loaiphong.name) private loaiphongModel: Model<Loaiphong>) { }

  async create(createLoaiphongDto: CreateLoaiphongDto) {
    return await this.loaiphongModel.create({
      ...createLoaiphongDto
    })
  }
  async createMany(createLoaiphongDto: CreateLoaiphongDto[]) {
    return await this.loaiphongModel.insertMany(createLoaiphongDto);
  }

  async findAll(current: number, pageSize: number, queryString: string) {
    let { filter, population } = aqp(queryString)
    let { sort }: { sort: any } = aqp(queryString)
    delete filter.current
    delete filter.pageSize
    let defaultLimit = +pageSize ? +pageSize : 10
    let defaultCurrent = +current ? +current : 1
    let offset = (+defaultCurrent - 1) * (+defaultLimit)
    const totalItems = await this.loaiphongModel.countDocuments(filter)
    const totalPages = Math.ceil(totalItems / defaultLimit)
    if (isEmpty(sort)) {
      sort = "name"
    }
    let res = await this.loaiphongModel.find(filter)
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
    return await this.loaiphongModel.findOne({ _id: id });
  }

  async update(id: string, updateLoaiphongDto: UpdateLoaiphongDto) {
    return await this.loaiphongModel.updateOne({ _id: id }, updateLoaiphongDto);
  }

  async remove(id: string) {
    // throw new Error('Method not implemented.');
    return await this.loaiphongModel.deleteOne({ _id: id });
  }

  async removeMany(ids: any[]) {
    return await this.loaiphongModel.deleteMany({ _id: { $in: ids } });
  }
}
