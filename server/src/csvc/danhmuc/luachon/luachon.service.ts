import { Injectable } from '@nestjs/common';
import { CreateLuachonDto } from './dto/create-luachon.dto';
import { UpdateLuachonDto } from './dto/update-luachon.dto';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Luachon } from 'src/csvc/danhmuc/luachon/schemas/luachon.schema';
import { isEmpty } from 'class-validator';
import aqp from 'api-query-params';

@Injectable()
export class LuachonService {
  constructor(@InjectModel(Luachon.name) private luachonModel: Model<Luachon>) { }

  async create(createLuachonDto: CreateLuachonDto) {
    return await this.luachonModel.create({
      ...createLuachonDto
    })
  }

  async createMany(createLuachonDto: CreateLuachonDto[]) {
    return await this.luachonModel.insertMany(createLuachonDto);
  }

  async findAll(current: number, pageSize: number, queryString: string) {
    let { filter, population } = aqp(queryString)
    let { sort }: { sort: any } = aqp(queryString)
    delete filter.current
    delete filter.pageSize
    let defaultLimit = +pageSize ? +pageSize : 10
    let defaultCurrent = +current ? +current : 1
    let offset = (+defaultCurrent - 1) * (+defaultLimit)
    const totalItems = await this.luachonModel.countDocuments(filter)
    const totalPages = Math.ceil(totalItems / defaultLimit)
    if (isEmpty(sort)) {
      sort = "name"
    }
    let units = await this.luachonModel.find(filter)
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
    return await this.luachonModel.findOne({ _id: id });
  }

  async update(id: string, updateLuachonDto: UpdateLuachonDto) {
    return await this.luachonModel.updateOne({ _id: id }, updateLuachonDto);
  }

  async remove(id: string) {
    // throw new Error('Method not implemented.');
    return await this.luachonModel.deleteOne({ _id: id });
  }

  async removeMany(ids: any[]) {
    return await this.luachonModel.deleteMany({ _id: { $in: ids } });
  }
}
