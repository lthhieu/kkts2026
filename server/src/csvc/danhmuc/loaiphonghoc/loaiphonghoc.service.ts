import { Injectable } from '@nestjs/common';
import { CreateLoaiphonghocDto } from './dto/create-loaiphonghoc.dto';
import { UpdateLoaiphonghocDto } from './dto/update-loaiphonghoc.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Loaiphonghoc } from 'src/csvc/danhmuc/loaiphonghoc/schemas/loaiphonghoc.schema';
import { Model } from 'mongoose';
import aqp from 'api-query-params';
import { isEmpty } from 'class-validator';

@Injectable()
export class LoaiphonghocService {
  constructor(@InjectModel(Loaiphonghoc.name) private loaiphonghocModel: Model<Loaiphonghoc>) { }

  async create(createLoaiphonghocDto: CreateLoaiphonghocDto) {
    return await this.loaiphonghocModel.create({
      ...createLoaiphonghocDto
    })
  }

  async createMany(createLoaiphonghocDto: CreateLoaiphonghocDto[]) {
    return await this.loaiphonghocModel.insertMany(createLoaiphonghocDto);
  }

  async findAll(current: number, pageSize: number, queryString: string) {
    let { filter, population } = aqp(queryString)
    let { sort }: { sort: any } = aqp(queryString)
    delete filter.current
    delete filter.pageSize
    let defaultLimit = +pageSize ? +pageSize : 10
    let defaultCurrent = +current ? +current : 1
    let offset = (+defaultCurrent - 1) * (+defaultLimit)
    const totalItems = await this.loaiphonghocModel.countDocuments(filter)
    const totalPages = Math.ceil(totalItems / defaultLimit)
    if (isEmpty(sort)) {
      sort = "name"
    }
    let units = await this.loaiphonghocModel.find(filter)
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
    return await this.loaiphonghocModel.findOne({ _id: id });
  }

  async update(id: string, updateLoaiphonghocDto: UpdateLoaiphonghocDto) {
    return await this.loaiphonghocModel.updateOne({ _id: id }, updateLoaiphonghocDto);
  }

  async remove(id: string) {
    // throw new Error('Method not implemented.');
    return await this.loaiphonghocModel.deleteOne({ _id: id });
  }

  async removeMany(ids: any[]) {
    return await this.loaiphonghocModel.deleteMany({ _id: { $in: ids } });
  }
}
