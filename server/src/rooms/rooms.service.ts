import { Injectable } from '@nestjs/common';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Room } from 'src/rooms/schemas/room.schema';
import { Model } from 'mongoose';
import aqp from 'api-query-params';
import { isEmpty } from 'class-validator';

@Injectable()
export class RoomsService {
  constructor(@InjectModel(Room.name) private roomModel: Model<Room>) { }

  async create(createRoomDto: CreateRoomDto) {
    const { info } = createRoomDto
    const currentDescription = info[info.length - 1].description
    const currentYear = info[info.length - 1].year
    const currentUnit = info[info.length - 1].unit
    return await this.roomModel.create({
      ...createRoomDto,
      currentDescription,
      currentYear,
      currentUnit
    })
  }

  async createMany(createRoomDto: CreateRoomDto[]) {

    return await this.roomModel.insertMany(createRoomDto);
  }

  async findAll(current: number, pageSize: number, queryString: string) {
    let { filter, population } = aqp(queryString)
    let { sort }: { sort: any } = aqp(queryString)
    delete filter.current
    delete filter.pageSize
    let defaultLimit = +pageSize ? +pageSize : 10
    let defaultCurrent = +current ? +current : 1
    let offset = (+defaultCurrent - 1) * (+defaultLimit)
    const totalItems = (await this.roomModel.find(filter)).length
    const totalPages = Math.ceil(totalItems / defaultLimit)
    if (isEmpty(sort)) {
      sort = "name"
    }
    let rooms = await this.roomModel.find(filter)
      .skip(offset)
      .limit(defaultLimit)
      .sort(sort)
      .populate(population)
      .populate({ path: 'info.unit', select: 'name' })
      .populate({ path: 'currentUnit', select: 'name' })
      .exec()
    return {
      meta: {
        current: defaultCurrent, //trang hiện tại
        pageSize: defaultLimit, //số lượng bản ghi đã lấy
        pages: totalPages, //tổng số trang với điều kiện query
        total: totalItems // tổng số phần tử (số bản ghi)
      },
      result: rooms
    }
  }

  async findOne(id: string) {
    return await this.roomModel.findOne({ _id: id })
      .populate({ path: 'info.unit', select: 'name' });
  }

  async update(id: string, updateRoomDto: UpdateRoomDto) {
    const { info, ...rest } = updateRoomDto;
    const currentDescription = info ? info[info.length - 1].description : ''
    const currentYear = info ? info[info.length - 1].year : ''
    const currentUnit = info ? info[info.length - 1].unit : ''

    return await this.roomModel.updateOne({ _id: id }, {
      ...rest,
      ...(info !== undefined && { $set: { info } }),
      currentDescription,
      currentYear,
      currentUnit
    });
  }

  async remove(id: string) {
    return await this.roomModel.deleteOne({ _id: id });
  }
  removeMany(ids: any[]) {
    return this.roomModel.deleteMany({ _id: { $in: ids } });
  }
}
