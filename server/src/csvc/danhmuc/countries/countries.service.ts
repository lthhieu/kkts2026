import { Injectable } from '@nestjs/common';
import { CreateCountryDto } from './dto/create-country.dto';
import { UpdateCountryDto } from './dto/update-country.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Country } from 'src/csvc/danhmuc/countries/schemas/country.schema';
import { Model } from 'mongoose';
import aqp from 'api-query-params';
import { isEmpty } from 'class-validator';

@Injectable()
export class CountriesService {
  constructor(@InjectModel(Country.name) private countryModel: Model<Country>) { }

  async create(createCountryDto: CreateCountryDto) {
    return await this.countryModel.create({
      ...createCountryDto
    })
  }

  async createMany(createCountryDto: CreateCountryDto[]) {
    const createdCountries = await this.countryModel.insertMany(createCountryDto);
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
    const totalItems = await this.countryModel.countDocuments(filter)
    const totalPages = Math.ceil(totalItems / defaultLimit)
    if (isEmpty(sort)) {
      sort = "name"
    }
    let res = await this.countryModel.find(filter)
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
    return await this.countryModel.findOne({ _id: id });
  }

  async update(id: string, updateCountryDto: UpdateCountryDto) {
    return await this.countryModel.updateOne({ _id: id }, updateCountryDto);
  }

  async remove(id: string) {
    // throw new Error('Method not implemented.');
    return await this.countryModel.deleteOne({ _id: id });
  }

  async removeMany(ids: any[]) {
    return await this.countryModel.deleteMany({ _id: { $in: ids } });
  }
}
