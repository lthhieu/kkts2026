import { Injectable } from '@nestjs/common';
import { CreateTinhtrangsudungDto } from './dto/create-tinhtrangsudung.dto';
import { UpdateTinhtrangsudungDto } from './dto/update-tinhtrangsudung.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Tinhtrangsudung } from 'src/csvc/danhmuc/tinhtrangsudung/schemas/tinhtrangsudung.schema';
import { Model } from 'mongoose';
import aqp from 'api-query-params';
import { isEmpty } from 'class-validator';

@Injectable()
export class TinhtrangsudungService {
  constructor(@InjectModel(Tinhtrangsudung.name) private tinhtrangsudungModel: Model<Tinhtrangsudung>) { }

  async create(createTinhtrangsudungDto: CreateTinhtrangsudungDto) {
    return await this.tinhtrangsudungModel.create({
      ...createTinhtrangsudungDto
    })
  }

  async createMany(createTinhtrangsudungDto: CreateTinhtrangsudungDto[]) {
    return await this.tinhtrangsudungModel.insertMany(createTinhtrangsudungDto);
  }

  async findAll(current: number, pageSize: number, queryString: string) {
    let { filter, population } = aqp(queryString)
    let { sort }: { sort: any } = aqp(queryString)
    delete filter.current
    delete filter.pageSize
    let defaultLimit = +pageSize ? +pageSize : 10
    let defaultCurrent = +current ? +current : 1
    let offset = (+defaultCurrent - 1) * (+defaultLimit)
    const totalItems = await this.tinhtrangsudungModel.countDocuments(filter)
    const totalPages = Math.ceil(totalItems / defaultLimit)
    if (isEmpty(sort)) {
      sort = "name"
    }
    let units = await this.tinhtrangsudungModel.find(filter)
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
    return await this.tinhtrangsudungModel.findOne({ _id: id });
  }

  async update(id: string, updateTinhtrangsudungDto: UpdateTinhtrangsudungDto) {
    return await this.tinhtrangsudungModel.updateOne({ _id: id }, updateTinhtrangsudungDto);
  }

  async remove(id: string) {
    // throw new Error('Method not implemented.');
    return await this.tinhtrangsudungModel.deleteOne({ _id: id });
  }

  async removeMany(ids: any[]) {
    return await this.tinhtrangsudungModel.deleteMany({ _id: { $in: ids } });
  }
}
