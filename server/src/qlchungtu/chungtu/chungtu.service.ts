import { Injectable } from '@nestjs/common';
import { CreateChungtuDto } from './dto/create-chungtu.dto';
import { UpdateChungtuDto } from './dto/update-chungtu.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Chungtu } from 'src/qlchungtu/chungtu/schemas/chungtu.schema';
import { Model } from 'mongoose';
import aqp from 'api-query-params';
import { isEmpty } from 'class-validator';

@Injectable()
export class ChungtuService {
  constructor(@InjectModel(Chungtu.name) private chungtuModel: Model<Chungtu>) { }

  async create(createChungtuDto: CreateChungtuDto, user: IUser) {
    return await this.chungtuModel.create({
      ...createChungtuDto,
      user
    })
  }

  async createMany(createChungtuDto: CreateChungtuDto[], user: IUser) {
    const data = createChungtuDto.map(item => ({
      ...item,
      user,
    }));

    return await this.chungtuModel.insertMany(data);
  }

  async findAll(current: number, pageSize: number, queryString: string) {
    let { filter, population } = aqp(queryString)
    let { sort }: { sort: any } = aqp(queryString)
    delete filter.current
    delete filter.pageSize
    let defaultLimit = +pageSize ? +pageSize : 10
    let defaultCurrent = +current ? +current : 1
    let offset = (+defaultCurrent - 1) * (+defaultLimit)
    const totalItems = await this.chungtuModel.countDocuments(filter)
    const totalPages = Math.ceil(totalItems / defaultLimit)
    if (isEmpty(sort)) {
      sort = "ngaynhan"
    }
    let chungtus = await this.chungtuModel.find(filter)
      .skip(offset)
      .limit(defaultLimit)
      .sort(sort)
      .populate(population)
      .populate({
        path: 'user',
        select: 'name',
      })
      .populate({
        path: 'ncc',
        select: 'name',
      }).populate({
        path: 'updatedBy',
        select: 'name',
      })
      .exec()
    return {
      meta: {
        current: defaultCurrent, //trang hiện tại
        pageSize: defaultLimit, //số lượng bản ghi đã lấy
        pages: totalPages, //tổng số trang với điều kiện query
        total: totalItems // tổng số phần tử (số bản ghi)
      },
      result: chungtus
    }
  }

  async findOne(id: string) {
    return await this.chungtuModel.findOne({ _id: id }).populate({
      path: 'user',
      select: 'name',
    }).populate({
      path: 'ncc',
      select: 'name',
    }).populate({
      path: 'updatedBy',
      select: 'name',
    });
  }

  async update(id: string, updateChungtuDto: UpdateChungtuDto, user: IUser) {
    return await this.chungtuModel.updateOne({ _id: id }, { ...updateChungtuDto, updatedBy: user });
  }

  async remove(id: string) {
    // throw new Error('Method not implemented.');
    return await this.chungtuModel.deleteOne({ _id: id });
  }

  async removeMany(ids: any[]) {
    return await this.chungtuModel.deleteMany({ _id: { $in: ids } });
  }

  async exportAll(month?: number, year?: number) {
    const filter: any = {};

    if (year) {
      if (month) {
        // Lọc theo tháng + năm
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 1);

        filter.ngaynhan = {
          $gte: startDate,
          $lt: endDate,
        };
      } else {
        // Lọc theo năm
        const startDate = new Date(year, 0, 1);
        const endDate = new Date(year + 1, 0, 1);

        filter.ngaynhan = {
          $gte: startDate,
          $lt: endDate,
        };
      }
    }

    return this.chungtuModel
      .find(filter)
      .populate({
        path: 'ncc',
        select: 'name',
      })
      .sort({ ngaynhan: -1 })
      .lean();
  }
}
