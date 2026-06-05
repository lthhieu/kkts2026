import { Injectable } from '@nestjs/common';
import { CreateMaytoantruongDto } from './dto/create-maytoantruong.dto';
import { UpdateMaytoantruongDto } from './dto/update-maytoantruong.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Maytoantruong } from 'src/csvc/maytoantruong/schemas/maytoantruong.schema';
import { Model } from 'mongoose';
import aqp from 'api-query-params';
import { isEmpty } from 'class-validator';

@Injectable()
export class MaytoantruongService {

  constructor(@InjectModel(Maytoantruong.name) private maytoantruongModel: Model<Maytoantruong>) { }


  async create(createMaytoantruongDto: CreateMaytoantruongDto) {
    return await this.maytoantruongModel.create({ ...createMaytoantruongDto });
  }

  async createMany(createMaytoantruongDto: CreateMaytoantruongDto[]) {
    return await this.maytoantruongModel.insertMany(createMaytoantruongDto);
  }

  async summary() {
    return await this.maytoantruongModel.aggregate([
      {
        $group: {
          _id: '$cate',
          totalSL: {
            $sum: '$sl',
          },
          totalNguyenGia: {
            $sum: '$nguyengia',
          },
        },
      },
      {
        $project: {
          _id: 0,
          cate: '$_id',
          totalSL: 1,
          totalNguyenGia: 1,
        },
      },
      {
        $sort: {
          cate: 1,
        },
      },
    ]);
  }

  async findAll(current: number, pageSize: number, queryString: string) {
    let { filter, population } = aqp(queryString);
    let { sort }: { sort: any } = aqp(queryString);
    delete filter.current;
    delete filter.pageSize;
    let defaultLimit = +pageSize ? +pageSize : 10;
    let defaultCurrent = +current ? +current : 1;
    let offset = (defaultCurrent - 1) * defaultLimit;
    const totalItems = await this.maytoantruongModel.countDocuments(filter);
    const totalPages = Math.ceil(totalItems / defaultLimit);
    if (isEmpty(sort)) {
      sort = '-createdAt';
    }
    const result = await this.maytoantruongModel
      .find(filter)
      .skip(offset)
      .limit(defaultLimit)
      .sort(sort)
      .populate(population)
      .populate({ path: 'unit', select: 'name' })
      .populate({ path: 'room', select: 'name' })
      .exec();
    return {
      meta: {
        current: defaultCurrent,
        pageSize: defaultLimit,
        pages: totalPages,
        total: totalItems,
      },
      result,
    };
  }

  async findOne(id: string) {
    return await this.maytoantruongModel
      .findOne({ _id: id }).populate({ path: 'unit', select: 'name' })
      .populate({ path: 'room', select: 'name' })
  }

  async update(id: string, updateMaytoantruongDto: UpdateMaytoantruongDto) {
    return await this.maytoantruongModel.updateOne({ _id: id }, updateMaytoantruongDto);
  }

  async remove(id: string) {
    return await this.maytoantruongModel.deleteOne({ _id: id });
  }

  async removeMany(ids: any[]) {
    return await this.maytoantruongModel.deleteMany({ _id: { $in: ids } });
  }
}
