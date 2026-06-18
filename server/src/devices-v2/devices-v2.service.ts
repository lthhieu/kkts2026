import { Injectable } from '@nestjs/common';
import { CreateDevicesV2Dto } from './dto/create-devices-v2.dto';
import { UpdateDevicesV2Dto } from './dto/update-devices-v2.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DevicesV2 } from 'src/devices-v2/schemas/devices-v2.schema';
import aqp from 'api-query-params';
import { isEmpty } from 'class-validator';

@Injectable()
export class DevicesV2Service {
  constructor(@InjectModel(DevicesV2.name) private devicesV2Model: Model<DevicesV2>) { }

  async create(createDevicesV2Dto: CreateDevicesV2Dto) {
    const { childrenIds, ...payload } = createDevicesV2Dto;
    const allRooms = createDevicesV2Dto.usedLocation.map(item => item.room);

    const parent = await this.devicesV2Model.create({
      ...payload,
      currentRoom: allRooms[0]
    });

    if (childrenIds?.length) {
      await this.devicesV2Model.updateMany({ _id: { $in: childrenIds } },
        { $set: { parentId: parent._id } },
      );
    }

    return parent;
  }

  async createMany(createDevicesV2Dto: CreateDevicesV2Dto[]) {
    const payload = createDevicesV2Dto.map((dto) => {
      const usedLocation = dto.usedLocation ?? [];
      const currentRoom = usedLocation.map((item) => item.room);
      return {
        ...dto,
        currentRoom: currentRoom[0],
      };
    });

    const createdDevices = await this.devicesV2Model.insertMany(payload);
    return createdDevices;
  }

  async summaryByTypeAndUnit() {
    return this.devicesV2Model.aggregate([
      {
        $group: {
          _id: {
            type: '$type',
            unit: '$unit',
          },
          totalQuantity: {
            $sum: {
              $ifNull: ['$soKeToan.soLuong', 0],
            },
          },
          totalNguyenGia: {
            $sum: {
              $ifNull: ['$soKeToan.nguyenGia', 0],
            },
          },
          totalGiaTriConLai: {
            $sum: {
              $ifNull: ['$soKeToan.giaTriConLai', 0],
            },
          },
        },
      },
      {
        $lookup: {
          from: 'units',
          localField: '_id.unit',
          foreignField: '_id',
          as: 'unit',
        },
      },
      {
        $unwind: {
          path: '$unit',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: 0,
          type: '$_id.type',
          unitId: '$_id.unit',
          unitName: '$unit.name',
          totalQuantity: 1,
          totalNguyenGia: 1,
          totalGiaTriConLai: 1,
        },
      },
      {
        $sort: {
          type: 1,
          unitName: 1,
        },
      },
    ]);
  }

  async findAll(current: number, pageSize: number, queryString: string, user: IUser) {

    let { filter, population } = aqp(queryString);
    let { sort }: { sort: any } = aqp(queryString);

    delete filter.current;
    delete filter.pageSize;

    const defaultLimit = +pageSize || 20;
    const defaultCurrent = +current || 1;
    const offset =
      (defaultCurrent - 1) * defaultLimit;

    // Giáo viên chỉ xem đơn vị của mình
    if (user.role === 'gv') {
      filter = {
        ...filter,
        unit: user.unit,
      };
    }

    if (isEmpty(sort)) {
      sort = {
        unit: 1,
        name: 1,
      };
    }

    // Chỉ phân trang tài sản cha
    const rootFilter = {
      ...filter,
      parentId: null,
    };

    const totalItems =
      await this.devicesV2Model.countDocuments(
        rootFilter,
      );

    const totalPages = Math.ceil(
      totalItems / defaultLimit,
    );

    const parents =
      await this.devicesV2Model
        .find(rootFilter)
        .skip(offset)
        .limit(defaultLimit)
        .sort(sort)
        .populate(population)
        .populate({
          path: 'usedLocation.room',
          select: 'name',
        })
        .populate({
          path: 'currentRoom',
          select: 'name',
        })
        .populate({
          path: 'unit',
          select: 'name',
        })
        .lean();

    const parentIds = parents.map(
      (item: any) => item._id,
    );

    const children =
      await this.devicesV2Model
        .find({
          parentId: {
            $in: parentIds,
          },
        })
        .populate(population)
        .populate({
          path: 'usedLocation.room',
          select: 'name',
        })
        .populate({
          path: 'currentRoom',
          select: 'name',
        })
        .populate({
          path: 'unit',
          select: 'name',
        })
        .lean();

    const childrenMap =
      new Map<string, any[]>();

    children.forEach((child: any) => {
      const parentId =
        child.parentId.toString();

      if (!childrenMap.has(parentId)) {
        childrenMap.set(parentId, []);
      }

      childrenMap.get(parentId)!.push(
        child,
      );
    });

    const result = parents.map(
      (parent: any) => {
        const children =
          childrenMap.get(
            parent._id.toString(),
          ) ?? null;

        const totalSoKeToanNguyenGia =
          (parent.soKeToan?.nguyenGia ?? 0) +
          (
            children?.reduce(
              (sum: number, item: any) =>
                sum +
                (item.soKeToan?.nguyenGia ?? 0),
              0,
            ) ?? 0
          );

        const totalKiemKeNguyenGia =
          (parent.kiemKe?.nguyenGia ?? 0) +
          (
            children?.reduce(
              (sum: number, item: any) =>
                sum +
                (item.kiemKe?.nguyenGia ?? 0),
              0,
            ) ?? 0
          );

        return {
          ...parent,

          children,

          childrenIds: children && children.length > 0 ?
            children.map(
              (item: any) =>
                item._id.toString(),
            )
            : null,

          totalSoKeToanNguyenGia,
          totalKiemKeNguyenGia,
        };
      },
    );

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
    return await this.devicesV2Model
      .findOne({ _id: id })
      .populate({ path: 'usedLocation.room', select: 'name' })
      .populate({
        path: 'currentRoom', select: 'name users', populate: {
          path: 'users', select: 'name phone'
        }
      })
      .populate({ path: 'unit', select: 'name' })
      .exec();
  }

  async update(id: string, dto: UpdateDevicesV2Dto,) {
    const { childrenIds, usedLocation, ...payload } = dto;

    const updateData: any = {
      ...payload,
    };

    if (usedLocation !== undefined) {
      updateData.usedLocation = usedLocation;

      updateData.currentRoom = usedLocation.length > 0 ? usedLocation[usedLocation.length - 1].room
        : null;
    }

    await this.devicesV2Model.updateOne({ _id: id }, updateData);

    if (childrenIds) {

      // Bỏ liên kết toàn bộ con cũ
      await this.devicesV2Model.updateMany({ parentId: id as any, },
        {
          $set: {
            parentId: null,
          },
        },
      );

      // Gán lại các con mới
      if (childrenIds.length > 0) {
        await this.devicesV2Model.updateMany(
          {
            _id: {
              $in: childrenIds,
            },
          },
          {
            $set: {
              parentId: id,
            },
          },
        );
      }
    }

    return 'ok';
  }

  async remove(id: string) {

    // bỏ liên kết các tài sản con
    await this.devicesV2Model.updateMany({ parentId: id as any, },
      { $set: { parentId: null } });
    return await this.devicesV2Model.deleteOne({ _id: id });
  }

  async removeMany(ids: string[]) {
    // bỏ liên kết các tài sản con
    await this.devicesV2Model.updateMany({ parentId: { $in: ids as any } },
      { $set: { parentId: null } });
    return await this.devicesV2Model.deleteMany({ _id: { $in: ids } });
  }

  async findGetAll(current: number, pageSize: number, queryString: string) {
    let { filter, population } = aqp(queryString);
    let { sort }: { sort: any } = aqp(queryString);
    delete filter.current;
    delete filter.pageSize;
    let defaultLimit = +pageSize ? +pageSize : 10;
    let defaultCurrent = +current ? +current : 1;
    let offset = (defaultCurrent - 1) * defaultLimit;
    const totalItems = await this.devicesV2Model.countDocuments(filter);
    const totalPages = Math.ceil(totalItems / defaultLimit);
    if (isEmpty(sort)) {
      sort = 'unit name';
    }
    const result = await this.devicesV2Model
      .find(filter)
      .skip(offset)
      .limit(defaultLimit)
      .sort(sort)
      .populate(population)
      .populate({ path: 'unit', select: 'name' })
      .select('_id name')
      .exec();
    return {
      meta: {
        current: defaultCurrent,
        pageSize: defaultLimit,
        pages: totalPages,
        total: totalItems,
      },
      result,
    }
  }

  async exportAll(type: string, unit: string) {
    const parents = await this.devicesV2Model
      .find({
        parentId: null,
        type,
        unit: unit as any,
      })
      .sort('unit name')
      .populate({ path: 'usedLocation.room', select: 'name' })
      .populate({
        path: 'currentRoom', select: 'name users', populate: {
          path: 'users', select: 'name phone'
        }
      })
      .populate({ path: 'unit', select: 'name' })
      .lean();

    const parentIds = parents.map(
      (item: any) => item._id,
    );

    const children = await this.devicesV2Model
      .find({
        parentId: {
          $in: parentIds,
        },
      })
      .populate({ path: 'usedLocation.room', select: 'name' })
      .populate({
        path: 'currentRoom', select: 'name users', populate: {
          path: 'users', select: 'name phone'
        }
      })
      .populate({ path: 'unit', select: 'name' })
      .lean();

    const childrenMap = new Map<string, any[]>();

    children.forEach((child: any) => {
      const parentId = child.parentId.toString();

      if (!childrenMap.has(parentId)) {
        childrenMap.set(parentId, []);
      }

      childrenMap.get(parentId)!.push(child);
    });

    const result = parents
      .map((parent: any) => {
        const children =
          childrenMap.get(
            parent._id.toString(),
          ) ?? null;

        const totalSoKeToanNguyenGia =
          (parent.soKeToan?.nguyenGia ?? 0) +
          (
            children?.reduce(
              (sum: number, item: any) =>
                sum +
                (item.soKeToan?.nguyenGia ?? 0),
              0,
            ) ?? 0
          );

        const totalKiemKeNguyenGia =
          (parent.kiemKe?.nguyenGia ?? 0) +
          (
            children?.reduce(
              (sum: number, item: any) =>
                sum +
                (item.kiemKe?.nguyenGia ?? 0),
              0,
            ) ?? 0
          );

        return {
          ...parent,
          children,
          childrenIds: children
            ? children.map(
              (item: any) =>
                item._id.toString(),
            )
            : null,
          totalKiemKeNguyenGia,
          totalSoKeToanNguyenGia
        };
      })
      .sort((a, b) => {
        const unitCompare =
          (a.unit?.name ?? '')
            .localeCompare(
              b.unit?.name ?? '',
              'vi',
            );

        if (unitCompare !== 0) {
          return unitCompare;
        }

        const aHasChildren =
          (a.children?.length ?? 0) > 0;

        const bHasChildren =
          (b.children?.length ?? 0) > 0;

        if (
          aHasChildren !==
          bHasChildren
        ) {
          return aHasChildren
            ? -1
            : 1;
        }

        return (a.name ?? '')
          .localeCompare(
            b.name ?? '',
            'vi',
            {
              numeric: true,
            },
          );
      });

    return result;
  }

  async updateAllQualityAggregate(year: number) {
    const currentYear = year ?? new Date().getFullYear()
    const result = await this.devicesV2Model.updateMany(
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
}
