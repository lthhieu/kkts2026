import { Injectable } from '@nestjs/common';
import { CreateTinhtrangcsvcDto } from './dto/create-tinhtrangcsvc.dto';
import { UpdateTinhtrangcsvcDto } from './dto/update-tinhtrangcsvc.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Tinhtrangcsvc } from 'src/csvc/danhmuc/tinhtrangcsvc/schemas/tinhtrangcsvc.schema';
import { Model } from 'mongoose';
import aqp from 'api-query-params';
import { isEmpty } from 'class-validator';

@Injectable()
export class TinhtrangcsvcService {
  constructor(@InjectModel(Tinhtrangcsvc.name) private tinhtrangcsvcModel: Model<Tinhtrangcsvc>) { }

  async create(createTinhtrangcsvcDto: CreateTinhtrangcsvcDto) {
    return await this.tinhtrangcsvcModel.create({
      ...createTinhtrangcsvcDto
    })
  }

  async createMany(createTinhtrangcsvcDto: CreateTinhtrangcsvcDto[]) {
    return await this.tinhtrangcsvcModel.insertMany(createTinhtrangcsvcDto);
  }

  async findAll(current: number, pageSize: number, queryString: string) {
    let { filter, population } = aqp(queryString)
    let { sort }: { sort: any } = aqp(queryString)
    delete filter.current
    delete filter.pageSize
    let defaultLimit = +pageSize ? +pageSize : 10
    let defaultCurrent = +current ? +current : 1
    let offset = (+defaultCurrent - 1) * (+defaultLimit)
    const totalItems = await this.tinhtrangcsvcModel.countDocuments(filter)
    const totalPages = Math.ceil(totalItems / defaultLimit)
    if (isEmpty(sort)) {
      sort = "name"
    }
    let res = await this.tinhtrangcsvcModel.find(filter)
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
    return await this.tinhtrangcsvcModel.findOne({ _id: id });
  }

  async update(id: string, updateTinhtrangcsvcDto: UpdateTinhtrangcsvcDto) {
    return await this.tinhtrangcsvcModel.updateOne({ _id: id }, updateTinhtrangcsvcDto);
  }

  async remove(id: string) {
    // throw new Error('Method not implemented.');
    return await this.tinhtrangcsvcModel.deleteOne({ _id: id });
  }

  async removeMany(ids: any[]) {
    return await this.tinhtrangcsvcModel.deleteMany({ _id: { $in: ids } });
  }
}
