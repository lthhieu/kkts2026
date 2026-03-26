import { Injectable } from '@nestjs/common';
import { CreateMucdichsudungdatDto } from './dto/create-mucdichsudungdat.dto';
import { UpdateMucdichsudungdatDto } from './dto/update-mucdichsudungdat.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Mucdichsudungdat } from 'src/csvc/danhmuc/mucdichsudungdat/schemas/mucdichsudungdat.schema';
import { Model } from 'mongoose';
import aqp from 'api-query-params';
import { isEmpty } from 'class-validator';

@Injectable()
export class MucdichsudungdatService {
  constructor(@InjectModel(Mucdichsudungdat.name) private mucdichsudungdatModel: Model<Mucdichsudungdat>) { }

  async create(createMucdichsudungdatDto: CreateMucdichsudungdatDto) {
    return await this.mucdichsudungdatModel.create({
      ...createMucdichsudungdatDto
    })
  }

  async createMany(createMucdichsudungdatDto: CreateMucdichsudungdatDto[]) {
    return await this.mucdichsudungdatModel.insertMany(createMucdichsudungdatDto);
  }

  async findAll(current: number, pageSize: number, queryString: string) {
    let { filter, population } = aqp(queryString)
    let { sort }: { sort: any } = aqp(queryString)
    delete filter.current
    delete filter.pageSize
    let defaultLimit = +pageSize ? +pageSize : 10
    let defaultCurrent = +current ? +current : 1
    let offset = (+defaultCurrent - 1) * (+defaultLimit)
    const totalItems = await this.mucdichsudungdatModel.countDocuments(filter)
    const totalPages = Math.ceil(totalItems / defaultLimit)
    if (isEmpty(sort)) {
      sort = "name"
    }
    let units = await this.mucdichsudungdatModel.find(filter)
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
    return await this.mucdichsudungdatModel.findOne({ _id: id });
  }

  async update(id: string, updateMucdichsudungdatDto: UpdateMucdichsudungdatDto) {
    return await this.mucdichsudungdatModel.updateOne({ _id: id }, updateMucdichsudungdatDto);
  }

  async remove(id: string) {
    // throw new Error('Method not implemented.');
    return await this.mucdichsudungdatModel.deleteOne({ _id: id });
  }

  async removeMany(ids: any[]) {
    return await this.mucdichsudungdatModel.deleteMany({ _id: { $in: ids } });
  }
}
