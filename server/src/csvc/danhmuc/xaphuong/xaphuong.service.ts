import { Injectable } from '@nestjs/common';
import { CreateXaphuongDto } from './dto/create-xaphuong.dto';
import { UpdateXaphuongDto } from './dto/update-xaphuong.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Xaphuong } from 'src/csvc/danhmuc/xaphuong/schemas/xaphuong.schema';
import { Model } from 'mongoose';
import { isEmpty } from 'class-validator';
import aqp from 'api-query-params';

@Injectable()
export class XaphuongService {
  constructor(@InjectModel(Xaphuong.name) private xaphuongModel: Model<Xaphuong>) { }

  async create(createXaphuongDto: CreateXaphuongDto) {
    return await this.xaphuongModel.create({
      ...createXaphuongDto
    })
  }

  async createMany(createXaphuongDto: CreateXaphuongDto[]) {
    return await this.xaphuongModel.insertMany(createXaphuongDto);
  }

  async findAll(current: number, pageSize: number, queryString: string) {
    let { filter, population } = aqp(queryString)
    let { sort }: { sort: any } = aqp(queryString)
    delete filter.current
    delete filter.pageSize
    let defaultLimit = +pageSize ? +pageSize : 10
    let defaultCurrent = +current ? +current : 1
    let offset = (+defaultCurrent - 1) * (+defaultLimit)
    const totalItems = await this.xaphuongModel.countDocuments(filter)
    const totalPages = Math.ceil(totalItems / defaultLimit)
    if (isEmpty(sort)) {
      sort = "name"
    }
    let units = await this.xaphuongModel.find(filter)
      .skip(offset)
      .limit(defaultLimit)
      .sort(sort)
      .populate(population)
      .populate({ path: 'tinhthanhpho', select: 'name' })
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
    return await this.xaphuongModel.findOne({ _id: id })
      .populate({ path: 'tinhthanhpho', select: 'name' });
  }

  async update(id: string, updateXaphuongDto: UpdateXaphuongDto) {
    return await this.xaphuongModel.updateOne({ _id: id }, updateXaphuongDto);
  }

  async remove(id: string) {
    // throw new Error('Method not implemented.');
    return await this.xaphuongModel.deleteOne({ _id: id });
  }

  async removeMany(ids: any[]) {
    return await this.xaphuongModel.deleteMany({ _id: { $in: ids } });
  }
}
