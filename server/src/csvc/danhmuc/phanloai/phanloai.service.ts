import { Injectable } from '@nestjs/common';
import { CreatePhanloaiDto } from './dto/create-phanloai.dto';
import { UpdatePhanloaiDto } from './dto/update-phanloai.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Phanloai } from 'src/csvc/danhmuc/phanloai/schemas/phanloai.schema';
import { Model } from 'mongoose';
import aqp from 'api-query-params';
import { isEmpty } from 'class-validator';

@Injectable()
export class PhanloaiService {
  constructor(@InjectModel(Phanloai.name) private phanloaiModel: Model<Phanloai>) { }

  async create(createPhanloaiDto: CreatePhanloaiDto) {
    return await this.phanloaiModel.create({
      ...createPhanloaiDto
    })
  }

  async createMany(createPhanloaiDto: CreatePhanloaiDto[]) {
    return await this.phanloaiModel.insertMany(createPhanloaiDto);
  }

  async findAll(current: number, pageSize: number, queryString: string) {
    let { filter, population } = aqp(queryString)
    let { sort }: { sort: any } = aqp(queryString)
    delete filter.current
    delete filter.pageSize
    let defaultLimit = +pageSize ? +pageSize : 10
    let defaultCurrent = +current ? +current : 1
    let offset = (+defaultCurrent - 1) * (+defaultLimit)
    const totalItems = await this.phanloaiModel.countDocuments(filter)
    const totalPages = Math.ceil(totalItems / defaultLimit)
    if (isEmpty(sort)) {
      sort = "name"
    }
    let units = await this.phanloaiModel.find(filter)
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
    return await this.phanloaiModel.findOne({ _id: id });
  }

  async update(id: string, updatePhanloaiDto: UpdatePhanloaiDto) {
    return await this.phanloaiModel.updateOne({ _id: id }, updatePhanloaiDto);
  }

  async remove(id: string) {
    // throw new Error('Method not implemented.');
    return await this.phanloaiModel.deleteOne({ _id: id });
  }

  async removeMany(ids: any[]) {
    return await this.phanloaiModel.deleteMany({ _id: { $in: ids } });
  }
}
