import { Injectable } from '@nestjs/common';
import { CreateLinhvucdaotaoDto } from './dto/create-linhvucdaotao.dto';
import { UpdateLinhvucdaotaoDto } from './dto/update-linhvucdaotao.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Linhvucdaotao } from 'src/csvc/danhmuc/linhvucdaotao/schemas/linhvucdaotao.schema';
import { Model } from 'mongoose';
import { isEmpty } from 'class-validator';
import aqp from 'api-query-params';

@Injectable()
export class LinhvucdaotaoService {
  constructor(@InjectModel(Linhvucdaotao.name) private linhvucdaotaoModel: Model<Linhvucdaotao>) { }

  async create(createLinhvucdaotaoDto: CreateLinhvucdaotaoDto) {
    return await this.linhvucdaotaoModel.create({
      ...createLinhvucdaotaoDto
    })
  }

  async createMany(createLinhvucdaotaoDto: CreateLinhvucdaotaoDto[]) {
    const createdCountries = await this.linhvucdaotaoModel.insertMany(createLinhvucdaotaoDto);
    return createdCountries;
  }

  async findAll(current: number, pageSize: number, queryString: string) {
    let { filter, population } = aqp(queryString)
    let { sort }: { sort: any } = aqp(queryString)
    delete filter.current
    delete filter.pageSize
    let defaultLimit = +pageSize ? +pageSize : 10
    let defaultCurrent = +current ? +current : 1
    let offset = (+defaultCurrent - 1) * (+defaultLimit)
    const totalItems = await this.linhvucdaotaoModel.countDocuments(filter)
    const totalPages = Math.ceil(totalItems / defaultLimit)
    if (isEmpty(sort)) {
      sort = "name"
    }
    let res = await this.linhvucdaotaoModel.find(filter)
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
    return await this.linhvucdaotaoModel.findOne({ _id: id });
  }

  async update(id: string, updateLinhvucdaotaoDto: UpdateLinhvucdaotaoDto) {
    return await this.linhvucdaotaoModel.updateOne({ _id: id }, updateLinhvucdaotaoDto);
  }

  async remove(id: string) {
    // throw new Error('Method not implemented.');
    return await this.linhvucdaotaoModel.deleteOne({ _id: id });
  }

  async removeMany(ids: any[]) {
    return await this.linhvucdaotaoModel.deleteMany({ _id: { $in: ids } });
  }
}
