import { Injectable } from '@nestjs/common';
import { CreateHinhthucsudungDto } from './dto/create-hinhthucsudung.dto';
import { UpdateHinhthucsudungDto } from './dto/update-hinhthucsudung.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Hinhthucsudung } from 'src/csvc/danhmuc/hinhthucsudung/schemas/hinhthucsudung.schema';
import { Model } from 'mongoose';
import aqp from 'api-query-params';
import { isEmpty } from 'class-validator';

@Injectable()
export class HinhthucsudungService {
  constructor(@InjectModel(Hinhthucsudung.name) private hinhthucsudungModel: Model<Hinhthucsudung>) { }

  async create(createHinhthucsudungDto: CreateHinhthucsudungDto) {
    return await this.hinhthucsudungModel.create({
      ...createHinhthucsudungDto
    })
  }

  async createMany(createHinhthucsudungDto: CreateHinhthucsudungDto[]) {
    return await this.hinhthucsudungModel.insertMany(createHinhthucsudungDto);
  }

  async findAll(current: number, pageSize: number, queryString: string) {
    let { filter, population } = aqp(queryString)
    let { sort }: { sort: any } = aqp(queryString)
    delete filter.current
    delete filter.pageSize
    let defaultLimit = +pageSize ? +pageSize : 10
    let defaultCurrent = +current ? +current : 1
    let offset = (+defaultCurrent - 1) * (+defaultLimit)
    const totalItems = await this.hinhthucsudungModel.countDocuments(filter)
    const totalPages = Math.ceil(totalItems / defaultLimit)
    if (isEmpty(sort)) {
      sort = "name"
    }
    let units = await this.hinhthucsudungModel.find(filter)
      .skip(offset)
      .limit(defaultLimit)
      .sort(sort)
      .populate(population)
      .exec()
    return {
      meta: {
        current: defaultCurrent,
        pageSize: defaultLimit,
        pages: totalPages,
        total: totalItems
      },
      result: units
    }
  }

  async findOne(id: string) {
    return await this.hinhthucsudungModel.findOne({ _id: id });
  }

  async update(id: string, updateHinhthucsudungDto: UpdateHinhthucsudungDto) {
    return await this.hinhthucsudungModel.updateOne({ _id: id }, updateHinhthucsudungDto);
  }

  async remove(id: string) {
    return await this.hinhthucsudungModel.deleteOne({ _id: id });
  }

  async removeMany(ids: any[]) {
    return await this.hinhthucsudungModel.deleteMany({ _id: { $in: ids } });
  }
}
