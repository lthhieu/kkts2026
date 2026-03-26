import { Injectable } from '@nestjs/common';
import { CreateTinhthanhphoDto } from './dto/create-tinhthanhpho.dto';
import { UpdateTinhthanhphoDto } from './dto/update-tinhthanhpho.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Tinhthanhpho } from 'src/csvc/danhmuc/tinhthanhpho/schemas/tinhthanhpho.schema';
import { Model } from 'mongoose';
import { isEmpty } from 'class-validator';
import aqp from 'api-query-params';

@Injectable()
export class TinhthanhphoService {
  constructor(@InjectModel(Tinhthanhpho.name) private tinhthanhphoModel: Model<Tinhthanhpho>) { }

  async create(createTinhthanhphoDto: CreateTinhthanhphoDto) {
    return await this.tinhthanhphoModel.create({
      ...createTinhthanhphoDto
    })
  }

  async createMany(createTinhthanhphoDto: CreateTinhthanhphoDto[]) {
    return await this.tinhthanhphoModel.insertMany(createTinhthanhphoDto);
  }

  async findAll(current: number, pageSize: number, queryString: string) {
    let { filter, population } = aqp(queryString)
    let { sort }: { sort: any } = aqp(queryString)
    delete filter.current
    delete filter.pageSize
    let defaultLimit = +pageSize ? +pageSize : 10
    let defaultCurrent = +current ? +current : 1
    let offset = (+defaultCurrent - 1) * (+defaultLimit)
    const totalItems = await this.tinhthanhphoModel.countDocuments(filter)
    const totalPages = Math.ceil(totalItems / defaultLimit)
    if (isEmpty(sort)) {
      sort = "name"
    }
    let units = await this.tinhthanhphoModel.find(filter)
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
    return await this.tinhthanhphoModel.findOne({ _id: id });
  }

  async update(id: string, updateTinhthanhphoDto: UpdateTinhthanhphoDto) {
    return await this.tinhthanhphoModel.updateOne({ _id: id }, updateTinhthanhphoDto);
  }

  async remove(id: string) {
    // throw new Error('Method not implemented.');
    return await this.tinhthanhphoModel.deleteOne({ _id: id });
  }

  async removeMany(ids: any[]) {
    return await this.tinhthanhphoModel.deleteMany({ _id: { $in: ids } });
  }
}
