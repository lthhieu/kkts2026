import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateDeviceDto } from './dto/create-device.dto';
import { UpdateDeviceDto } from './dto/update-device.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Device } from 'src/devices/schemas/device.schema';
import { Model } from 'mongoose';
import aqp from 'api-query-params';
import { isEmpty } from 'class-validator';
import { CaslAbilityFactory } from 'src/casl/casl-ability.factory/casl-ability.factory';
import { Action, DeviceSubject } from 'src/configs/enum';

@Injectable()
export class DevicesService {
  constructor(@InjectModel(Device.name) private deviceModel: Model<Device>,
    private caslAbilityFactory: CaslAbilityFactory) { }

  async create(createDeviceDto: CreateDeviceDto) {
    const { usedLocation } = createDeviceDto
    const currentRoom = usedLocation[usedLocation.length - 1].room
    return await this.deviceModel.create({
      ...createDeviceDto,
      currentRoom
    })
  }

  async createMany(createDeviceDto: CreateDeviceDto[]) {
    const payload = createDeviceDto.map((dto) => {
      const usedLocation = dto.usedLocation ?? [];
      const currentRoom =
        usedLocation.length > 0 ? usedLocation[usedLocation.length - 1].room : null;
      return {
        ...dto,
        currentRoom,
      };
    });

    const createdDevices = await this.deviceModel.insertMany(payload);
    return createdDevices;
  }

  async findAll(current: number, pageSize: number, queryString: string, user: IUser) {
    let { filter, population } = aqp(queryString)
    let { sort }: { sort: any } = aqp(queryString)
    delete filter.current
    delete filter.pageSize

    let defaultLimit = +pageSize ? +pageSize : 10
    let defaultCurrent = +current ? +current : 1
    let offset = (+defaultCurrent - 1) * (+defaultLimit)

    filter = {
      ...filter,
      isDeleted: filter?.status === 'daxoa'
    };

    if (user.role === 'gv') {
      filter = {
        ...filter,
        unit: user.unit  // Gắn thêm điều kiện lọc theo unit
      };
    }
    const totalItems = (await this.deviceModel.find(filter)).length
    const totalPages = Math.ceil(totalItems / defaultLimit)
    if (isEmpty(sort)) {
      sort = { unit: 1, parent: 1, name: 1 };
    }
    let devices = await this.deviceModel.find(filter)
      .skip(offset)
      .limit(defaultLimit)
      .sort(sort)
      .populate(population)
      .populate({ path: 'usedLocation.room', select: 'name' })
      .populate({ path: 'currentRoom', select: 'name' })
      .populate({ path: 'unit', select: 'name' })
      .exec()
    return {
      meta: {
        current: defaultCurrent, //trang hiện tại
        pageSize: defaultLimit, //số lượng bản ghi đã lấy
        pages: totalPages, //tổng số trang với điều kiện query
        total: totalItems // tổng số phần tử (số bản ghi)
      },
      result: devices
    }
  }

  async findOne(id: string) {
    return await this.deviceModel
      .findOne({ _id: id })
      .populate({ path: 'usedLocation.room', select: 'name' })
      .populate({ path: 'currentRoom', select: 'name' })
      .populate({ path: 'unit', select: 'name' })
      .exec();
  }

  async update(id: string, updateDeviceDto: UpdateDeviceDto) {
    const { usedLocation, ...rest } = updateDeviceDto;
    const currentRoom = usedLocation ? usedLocation[usedLocation.length - 1].room : ''

    return await this.deviceModel.updateOne({ _id: id }, {
      ...rest,
      ...(usedLocation !== undefined && { $set: { usedLocation } }),
      currentRoom
    });

  }

  async updateAllQualityAggregate(year: number) {
    const currentYear = year ?? new Date().getFullYear()
    const result = await this.deviceModel.updateMany(
      {
        usedYear: { $exists: true, $ne: null },
        trongSoChatLuong: { $exists: true, $ne: null }
      },
      [ // Aggregation Pipeline (Dấu ngoặc vuông)
        {
          $set: {
            chatLuongConLai: {
              $cond: {
                if: { $gte: ["$usedYear", currentYear] },
                then: 100,
                else: {
                  $max: [
                    0,
                    {
                      $subtract: [
                        100,
                        {
                          $multiply: [
                            { $subtract: [currentYear, "$usedYear"] },
                            "$trongSoChatLuong"
                          ]
                        }
                      ]
                    }
                  ]
                }
              }
            }
          }
        }
      ],
      { updatePipeline: true }
    );

    return {
      matched: result.matchedCount,
      updated: result.modifiedCount
    };
  }

  async updateAllStatusAggregate() {
    const result = await this.deviceModel.updateMany(
      {
      },
      [ // Aggregation Pipeline (Dấu ngoặc vuông)
        {
          $set: {
            status: 'dangsudung'
          }
        }
      ],
      { updatePipeline: true }
    );

    return {
      matched: result.matchedCount,
      updated: result.modifiedCount
    };
  }

  async updateSoftDeleteAggregate() {
    const result = await this.deviceModel.updateMany(
      {
      },
      [ // Aggregation Pipeline (Dấu ngoặc vuông)
        {
          $set: {
            isDeleted: false,
            deletedAt: null,
            deletedBy: null
          }
        }
      ],
      { updatePipeline: true }
    );

    return {
      matched: result.matchedCount,
      updated: result.modifiedCount
    };
  }

  async remove(id: string, user: IUser) {
    const ability = this.caslAbilityFactory.createForUser(user);
    const device = await this.deviceModel.findOne({ _id: id });
    const deviceSubject = new DeviceSubject();
    deviceSubject._id = device?._id.toString()!;
    deviceSubject.unit = device?.unit?.toString()!;

    if (ability.can(Action.Delete, deviceSubject)) {
      return await this.deviceModel.deleteOne({ _id: id });
    }
    throw new ForbiddenException();
  }

  async softRemove(id: string, user: IUser) {
    const ability = this.caslAbilityFactory.createForUser(user);
    const device = await this.deviceModel.findOne({ _id: id });
    const deviceSubject = new DeviceSubject();
    deviceSubject._id = device?._id.toString()!;
    deviceSubject.unit = device?.unit?.toString()!;

    if (ability.can(Action.Delete, deviceSubject)) {
      return await this.deviceModel.updateOne({ _id: id }, { deletedAt: new Date(), deletedBy: user.email, isDeleted: true, status: 'daxoa' });
    }
    throw new ForbiddenException();
  }

  async removeMany(ids: any[], user: IUser) {
    const ability = this.caslAbilityFactory.createForUser(user);
    const device = await this.deviceModel.findOne({ _id: ids[0] });
    const deviceSubject = new DeviceSubject();
    deviceSubject._id = device?._id.toString()!;
    deviceSubject.unit = device?.unit?.toString()!;

    if (ability.can(Action.Delete, deviceSubject)) {
      return this.deviceModel.deleteMany({ _id: { $in: ids } });
    }
    throw new ForbiddenException();

  }
}
