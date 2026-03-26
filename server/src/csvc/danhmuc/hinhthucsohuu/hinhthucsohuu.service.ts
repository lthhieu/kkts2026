import { Injectable } from '@nestjs/common';
import { CreateHinhthucsohuuDto } from './dto/create-hinhthucsohuu.dto';
import { UpdateHinhthucsohuuDto } from './dto/update-hinhthucsohuu.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Hinhthucsohuu } from 'src/csvc/danhmuc/hinhthucsohuu/schemas/hinhthucsohuu.schema';
import { Model } from 'mongoose';
import aqp from 'api-query-params';
import { isEmpty } from 'class-validator';

@Injectable()
export class HinhthucsohuuService {
  constructor(@InjectModel(Hinhthucsohuu.name) private hinhthucsohuuModel: Model<Hinhthucsohuu>) { }

  async create(createHinhthucsohuuDto: CreateHinhthucsohuuDto) {
    return await this.hinhthucsohuuModel.create({
      ...createHinhthucsohuuDto
    })
  }

  async createMany(createHinhthucsohuuDto: CreateHinhthucsohuuDto[]) {
    return await this.hinhthucsohuuModel.insertMany(createHinhthucsohuuDto);
  }

  async findAll(current: number, pageSize: number, queryString: string) {
    let { filter, population } = aqp(queryString)
    let { sort }: { sort: any } = aqp(queryString)
    delete filter.current
    delete filter.pageSize
    let defaultLimit = +pageSize ? +pageSize : 10
    let defaultCurrent = +current ? +current : 1
    let offset = (+defaultCurrent - 1) * (+defaultLimit)
    const totalItems = await this.hinhthucsohuuModel.countDocuments(filter)
    const totalPages = Math.ceil(totalItems / defaultLimit)
    if (isEmpty(sort)) {
      sort = "name"
    }
    let units = await this.hinhthucsohuuModel.find(filter)
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
    return await this.hinhthucsohuuModel.findOne({ _id: id });
  }

  async update(id: string, updateHinhthucsohuuDto: UpdateHinhthucsohuuDto) {
    return await this.hinhthucsohuuModel.updateOne({ _id: id }, updateHinhthucsohuuDto);
  }

  async remove(id: string) {
    // throw new Error('Method not implemented.');
    return await this.hinhthucsohuuModel.deleteOne({ _id: id });
  }

  async removeMany(ids: any[]) {
    return await this.hinhthucsohuuModel.deleteMany({ _id: { $in: ids } });
  }
}
