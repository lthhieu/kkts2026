import { Injectable } from '@nestjs/common';
import { CreateMucdichsudungcsvcDto } from './dto/create-mucdichsudungcsvc.dto';
import { UpdateMucdichsudungcsvcDto } from './dto/update-mucdichsudungcsvc.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Mucdichsudungcsvc } from 'src/csvc/danhmuc/mucdichsudungcsvc/schemas/mucdichsudungcsvc.schema';
import { Model } from 'mongoose';
import aqp from 'api-query-params';
import { isEmpty } from 'class-validator';

@Injectable()
export class MucdichsudungcsvcService {
  constructor(@InjectModel(Mucdichsudungcsvc.name) private mucdichsudungcsvcModel: Model<Mucdichsudungcsvc>) { }

  async create(createMucdichsudungcsvcDto: CreateMucdichsudungcsvcDto) {
    return await this.mucdichsudungcsvcModel.create({
      ...createMucdichsudungcsvcDto
    })
  }

  async createMany(createMucdichsudungcsvcDto: CreateMucdichsudungcsvcDto[]) {
    return await this.mucdichsudungcsvcModel.insertMany(createMucdichsudungcsvcDto);
  }

  async findAll(current: number, pageSize: number, queryString: string) {
    let { filter, population } = aqp(queryString)
    let { sort }: { sort: any } = aqp(queryString)
    delete filter.current
    delete filter.pageSize
    let defaultLimit = +pageSize ? +pageSize : 10
    let defaultCurrent = +current ? +current : 1
    let offset = (+defaultCurrent - 1) * (+defaultLimit)
    const totalItems = await this.mucdichsudungcsvcModel.countDocuments(filter)
    const totalPages = Math.ceil(totalItems / defaultLimit)
    if (isEmpty(sort)) {
      sort = "name"
    }
    let res = await this.mucdichsudungcsvcModel.find(filter)
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
    return await this.mucdichsudungcsvcModel.findOne({ _id: id });
  }

  async update(id: string, updateMucdichsudungcsvcDto: UpdateMucdichsudungcsvcDto) {
    return await this.mucdichsudungcsvcModel.updateOne({ _id: id }, updateMucdichsudungcsvcDto);
  }

  async remove(id: string) {
    // throw new Error('Method not implemented.');
    return await this.mucdichsudungcsvcModel.deleteOne({ _id: id });
  }

  async removeMany(ids: any[]) {
    return await this.mucdichsudungcsvcModel.deleteMany({ _id: { $in: ids } });
  }
}
