import { ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateSnapshotDto } from './dto/create-snapshot.dto';
import { UpdateSnapshotDto } from './dto/update-snapshot.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Snapshot } from 'src/snapshot/schemas/snapshot.schema';
import { DevicesService } from 'src/devices/devices.service';
import { isEmpty } from 'class-validator';
import aqp from 'api-query-params';
import { CaslAbilityFactory } from 'src/casl/casl-ability.factory/casl-ability.factory';
import { Action, SnapshotSubject } from 'src/configs/enum';

@Injectable()
export class SnapshotService {
  constructor(@InjectModel(Snapshot.name) private snapshotModel: Model<Snapshot>,
    private devicesService: DevicesService,
    private caslAbilityFactory: CaslAbilityFactory) { }

  async create(createSnapshotDto: CreateSnapshotDto, user: IUser) {
    const { year } = createSnapshotDto

    const existing = await this.snapshotModel.exists({ year });
    if (existing) {
      throw new ConflictException(`Năm ${year} đã được chốt sổ trước đó.`);
    }

    // 2. Lấy toàn bộ thiết bị đang hoạt động, populate để lấy tên phòng/đơn vị
    const allDevices = await this.devicesService.findForSnapshot()

    if (allDevices.length === 0) {
      throw new NotFoundException('Không tìm thấy thiết bị nào để chốt sổ.');
    }

    // 3. Biến đổi dữ liệu thành định dạng snapshot (Denormalization)
    const snapshotsToCreate = allDevices.map(device => ({
      year,
      closedBy: user.email,
      name: device.name,
      description: device.description,
      room: (device?.currentRoom?.[0] as any)?.name || 'N/A',
      usedYear: device.usedYear,
      soKeToan: device.soKeToan,
      kiemKe: device.kiemKe,
      chenhLech: device.chenhLech,
      chatLuongConLai: device.chatLuongConLai,
      note: device.note,
      trongSoChatLuong: device.trongSoChatLuong,
      type: device.type,
      unit: (device.unit as any)?.name || 'N/A',
      parent: device?.parent || null,
      status: device.status,
      isDeleted: device.isDeleted,
      deletedAt: device.deletedAt,
      deletedBy: device.deletedBy
    }));

    // 4. Ghi hàng loạt vào database
    await this.snapshotModel.insertMany(snapshotsToCreate);

    return {
      message: `Chốt sổ thành công năm ${year} với ${snapshotsToCreate.length} thiết bị.`,
      count: snapshotsToCreate.length,
    };
  }

  // ✅ Chức năng phụ: Xem lại sổ đã chốt
  async getSnapshotsByYear(current: number, pageSize: number, queryString: string, user: IUser) {
    let { filter, population } = aqp(queryString)
    let { sort }: { sort: any } = aqp(queryString)
    delete filter.current
    delete filter.pageSize

    let defaultLimit = +pageSize ? +pageSize : 10
    let defaultCurrent = +current ? +current : 1
    let offset = (+defaultCurrent - 1) * (+defaultLimit)

    if (!filter.year) {
      filter = {
        ...filter,
        year: 1990
      };
    }

    if (user.role === 'gv') {
      filter = {
        ...filter,
        unit: user.unit  // Gắn thêm điều kiện lọc theo unit
      };
    }
    const totalItems = await this.snapshotModel.countDocuments(filter)
    const totalPages = Math.ceil(totalItems / defaultLimit)
    if (isEmpty(sort)) {
      sort = { unit: 1, parent: 1, name: 1 };
    }
    let devices = await this.snapshotModel.find(filter)
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
      result: devices
    }
  }

  async getAvailableYears() {
    const years = await this.snapshotModel.distinct('year');
    return {
      years: years.sort((a, b) => b - a).map((y) => ({
        value: String(y), label: String(y)
      }))
    }
  }

  async removeMany(year: number) {
    return await this.snapshotModel.deleteMany({ year });
  }

  findAll() {
    return `This action returns all snapshot`;
  }

  findOne(id: number) {
    return `This action returns a #${id} snapshot`;
  }

  update(id: number, updateSnapshotDto: UpdateSnapshotDto) {
    return `This action updates a #${id} snapshot`;
  }

  remove(id: number) {
    return `This action removes a #${id} snapshot`;
  }
}
