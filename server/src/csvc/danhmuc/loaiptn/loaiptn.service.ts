import { Injectable } from '@nestjs/common';
import { CreateLoaiptnDto } from './dto/create-loaiptn.dto';
import { UpdateLoaiptnDto } from './dto/update-loaiptn.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Loaiptn } from 'src/csvc/danhmuc/loaiptn/schemas/loaiptn.schema';
import { Model } from 'mongoose';
import aqp from 'api-query-params';
import { isEmpty } from 'class-validator';

@Injectable()
export class LoaiptnService {
  constructor(@InjectModel(Loaiptn.name) private loaiptnModel: Model<Loaiptn>) { }

  async create(createLoaiptnDto: CreateLoaiptnDto) {
    return await this.loaiptnModel.create({
      ...createLoaiptnDto
    })
  }
  async createMany(createLoaiptnDto: CreateLoaiptnDto[]) {
    return await this.loaiptnModel.insertMany(createLoaiptnDto);
  }

  async findAll(current: number, pageSize: number, queryString: string) {
    let { filter, population } = aqp(queryString)
    let { sort }: { sort: any } = aqp(queryString)
    delete filter.current
    delete filter.pageSize
    let defaultLimit = +pageSize ? +pageSize : 10
    let defaultCurrent = +current ? +current : 1
    let offset = (+defaultCurrent - 1) * (+defaultLimit)
    const totalItems = await this.loaiptnModel.countDocuments(filter)
    const totalPages = Math.ceil(totalItems / defaultLimit)
    if (isEmpty(sort)) {
      sort = "name"
    }
    let res = await this.loaiptnModel.find(filter)
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
    return await this.loaiptnModel.findOne({ _id: id });
  }

  async update(id: string, updateLoaiptnDto: UpdateLoaiptnDto) {
    return await this.loaiptnModel.updateOne({ _id: id }, updateLoaiptnDto);
  }

  async remove(id: string) {
    // throw new Error('Method not implemented.');
    return await this.loaiptnModel.deleteOne({ _id: id });
  }

  async removeMany(ids: any[]) {
    return await this.loaiptnModel.deleteMany({ _id: { $in: ids } });
  }
}
