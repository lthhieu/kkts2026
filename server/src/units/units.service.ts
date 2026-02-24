import { Injectable } from '@nestjs/common';
import { CreateUnitDto } from './dto/create-unit.dto';
import { UpdateUnitDto } from './dto/update-unit.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Unit } from 'src/units/schemas/unit.schema';
import { Model } from 'mongoose';
import aqp from 'api-query-params';
import { isEmpty } from 'class-validator';

@Injectable()
export class UnitsService {
  constructor(@InjectModel(Unit.name) private unitModel: Model<Unit>) { }

  async create(createUnitDto: CreateUnitDto) {
    return await this.unitModel.create({
      ...createUnitDto
    })
  }

  async createMany(createUnitDto: CreateUnitDto[]) {
    // insertMany accepts an array of plain JavaScript objects
    const createdUnits = await this.unitModel.insertMany(createUnitDto);
    return createdUnits;
  }

  async findAll(current: number, pageSize: number, queryString: string) {
    let { filter, population } = aqp(queryString)
    let { sort }: { sort: any } = aqp(queryString)
    delete filter.current
    delete filter.pageSize
    let defaultLimit = +pageSize ? +pageSize : 10
    let defaultCurrent = +current ? +current : 1
    let offset = (+defaultCurrent - 1) * (+defaultLimit)
    const totalItems = (await this.unitModel.find(filter)).length
    const totalPages = Math.ceil(totalItems / defaultLimit)
    if (isEmpty(sort)) {
      sort = "name"
    }
    let units = await this.unitModel.find(filter)
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

  findOne(id: string) {
    return this.unitModel.findOne({ _id: id });
  }

  update(id: string, updateUnitDto: UpdateUnitDto) {
    return this.unitModel.updateOne({ _id: id }, updateUnitDto);
  }

  remove(id: string) {
    // throw new Error('Method not implemented.');
    return this.unitModel.deleteOne({ _id: id });
  }

  removeMany(ids: any[]) {
    return this.unitModel.deleteMany({ _id: { $in: ids } });
  }
}
