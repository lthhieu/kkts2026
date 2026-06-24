import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import aqp from 'api-query-params';
import { isEmpty } from 'class-validator';
import { Ncc } from 'src/qlchungtu/ncc/schemas/ncc.schema';
import { CreateNccDto } from 'src/qlchungtu/ncc/dto/create-ncc.dto';
import { UpdateNccDto } from 'src/qlchungtu/ncc/dto/update-ncc.dto';

@Injectable()
export class NccsService {
  constructor(@InjectModel(Ncc.name) private nccModel: Model<Ncc>) { }

  async create(dto: CreateNccDto) {
    return await this.nccModel.create({
      ...dto
    })
  }

  async createMany(dto: CreateNccDto[]) {
    // insertMany accepts an array of plain JavaScript objects
    const createdNccs = await this.nccModel.insertMany(dto);
    return createdNccs;
  }

  async findAll(current: number, pageSize: number, queryString: string) {
    let { filter, population } = aqp(queryString)
    let { sort }: { sort: any } = aqp(queryString)
    delete filter.current
    delete filter.pageSize
    let defaultLimit = +pageSize ? +pageSize : 10
    let defaultCurrent = +current ? +current : 1
    let offset = (+defaultCurrent - 1) * (+defaultLimit)
    const totalItems = await this.nccModel.countDocuments(filter)
    const totalPages = Math.ceil(totalItems / defaultLimit)
    if (isEmpty(sort)) {
      sort = "name"
    }
    let nccs = await this.nccModel.find(filter)
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
      result: nccs
    }
  }

  async findOne(id: string) {
    return await this.nccModel.findOne({ _id: id });
  }

  async update(id: string, dto: UpdateNccDto) {
    return await this.nccModel.updateOne({ _id: id }, dto);
  }

  async remove(id: string) {
    // throw new Error('Method not implemented.');
    return await this.nccModel.deleteOne({ _id: id });
  }

  async removeMany(ids: any[]) {
    return await this.nccModel.deleteMany({ _id: { $in: ids } });
  }

  async exportAll() {
    return await this.nccModel.find().lean();
  }
}
