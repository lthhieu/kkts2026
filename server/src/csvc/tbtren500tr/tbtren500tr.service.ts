import { Injectable } from '@nestjs/common';
import { CreateTbtren500trDto } from './dto/create-tbtren500tr.dto';
import { UpdateTbtren500trDto } from './dto/update-tbtren500tr.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Tbtren500tr } from 'src/csvc/tbtren500tr/schemas/tbtren500tr.schema';
import aqp from 'api-query-params';
import { isEmpty } from 'class-validator';

@Injectable()
export class Tbtren500trService {
  constructor(@InjectModel(Tbtren500tr.name) private tbtren500trModel: Model<Tbtren500tr>) { }

  async create(createTbtren500trDto: CreateTbtren500trDto) {
    const { childrenIds, ...payload } = createTbtren500trDto;

    const parent = await this.tbtren500trModel.create(payload);

    if (childrenIds?.length) {
      await this.tbtren500trModel.updateMany({ _id: { $in: childrenIds } },
        { $set: { parentId: parent._id } },
      );
    }

    return parent;
  }

  async createMany(createTbtren500trDto: CreateTbtren500trDto[]) {
    return await this.tbtren500trModel.insertMany(createTbtren500trDto);
  }

  async findGetAll(current: number, pageSize: number, queryString: string) {
    let { filter, population } = aqp(queryString);
    let { sort }: { sort: any } = aqp(queryString);
    delete filter.current;
    delete filter.pageSize;
    let defaultLimit = +pageSize ? +pageSize : 10;
    let defaultCurrent = +current ? +current : 1;
    let offset = (defaultCurrent - 1) * defaultLimit;
    const totalItems = await this.tbtren500trModel.countDocuments(filter);
    const totalPages = Math.ceil(totalItems / defaultLimit);
    if (isEmpty(sort)) {
      sort = 'unit code name';
    }
    const result = await this.tbtren500trModel
      .find(filter)
      .skip(offset)
      .limit(defaultLimit)
      .sort(sort)
      .populate(population)
      .populate({ path: 'unit', select: 'name' })
      .select('_id code name')
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

  async findAll(current: number, pageSize: number, queryString: string) {
    let { filter, population } = aqp(queryString);
    let { sort }: { sort: any } = aqp(queryString);

    delete filter.current;
    delete filter.pageSize;

    const defaultLimit = +pageSize || 10;
    const defaultCurrent = +current || 1;
    const offset = (defaultCurrent - 1) * defaultLimit;

    if (isEmpty(sort)) {
      sort = 'unit code name';
    }

    // chỉ phân trang tài sản cha
    const rootFilter = {
      ...filter,
      parentId: null,
    };

    const totalItems =
      await this.tbtren500trModel.countDocuments(
        rootFilter,
      );

    const totalPages = Math.ceil(
      totalItems / defaultLimit,
    );

    const parents = await this.tbtren500trModel
      .find(rootFilter)
      .skip(offset)
      .limit(defaultLimit)
      .sort(sort)
      .populate(population)
      .populate({ path: 'unit', select: 'name' })
      .lean();

    const parentIds = parents.map(
      (item: any) => item._id,
    );

    // lấy toàn bộ tài sản con của các cha trong trang hiện tại
    const children = await this.tbtren500trModel
      .find({
        parentId: {
          $in: parentIds,
        },
      })
      .populate(population)
      .populate({ path: 'unit', select: 'name' })
      .lean();

    const childrenMap = new Map<string, any[]>();

    children.forEach((child: any) => {
      const parentId = child.parentId.toString();

      if (!childrenMap.has(parentId)) {
        childrenMap.set(parentId, []);
      }

      childrenMap.get(parentId)!.push({
        ...child,
        totalOriginalPrice:
          child.originalPrice ?? 0,
      });
    });

    const result = parents
      .map((parent: any) => {
        const children =
          childrenMap.get(
            parent._id.toString(),
          ) ?? null;

        const totalOriginalPrice =
          (parent.originalPrice ?? 0) +
          (
            children?.reduce(
              (sum: number, item: any) =>
                sum + (item.originalPrice ?? 0),
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

          totalOriginalPrice,
        };
      })
      .sort((a, b) => {

        // đơn vị
        const unitCompare =
          (a.unit?.name ?? '')
            .localeCompare(
              b.unit?.name ?? '',
              'vi',
            );

        if (unitCompare !== 0) {
          return unitCompare;
        }

        // có tài sản con lên trước
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

        // code
        return (a.code ?? '')
          .localeCompare(
            b.code ?? '',
            'vi',
            {
              numeric: true,
            },
          );
      });

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
    return await this.tbtren500trModel
      .findOne({ _id: id }).populate({ path: 'unit', select: 'name' });
  }

  async update(id: string, dto: UpdateTbtren500trDto) {

    const { childrenIds, ...payload } = dto;

    await this.tbtren500trModel.updateOne({ _id: id }, payload);

    if (childrenIds) {

      // bỏ con cũ
      await this.tbtren500trModel.updateMany({ parentId: id as any },
        { $set: { parentId: null } },
      );

      // gán con mới
      await this.tbtren500trModel.updateMany({ _id: { $in: childrenIds } },
        { $set: { parentId: id } });
    }
    return "ok"
  }

  async remove(id: string) {

    // bỏ liên kết các tài sản con
    await this.tbtren500trModel.updateMany({ parentId: id as any, },
      { $set: { parentId: null } });
    return await this.tbtren500trModel.deleteOne({ _id: id });
  }

  async removeMany(ids: string[]) {
    // bỏ liên kết các tài sản con
    await this.tbtren500trModel.updateMany({ parentId: { $in: ids as any } },
      { $set: { parentId: null } });
    return await this.tbtren500trModel.deleteMany({ _id: { $in: ids } });
  }

  async exportAll() {
    const parents = await this.tbtren500trModel
      .find({
        parentId: null,
      })
      .sort('unit code name')
      .populate({ path: 'unit', select: 'name' })
      .lean();

    const parentIds = parents.map(
      (item: any) => item._id,
    );

    const children = await this.tbtren500trModel
      .find({
        parentId: {
          $in: parentIds,
        },
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

        const totalOriginalPrice =
          (parent.originalPrice ?? 0) +
          (
            children?.reduce(
              (sum: number, item: any) =>
                sum +
                (item.originalPrice ?? 0),
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
          totalOriginalPrice,
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

        return (a.code ?? '')
          .localeCompare(
            b.code ?? '',
            'vi',
            {
              numeric: true,
            },
          );
      });

    return result;
  }

}
