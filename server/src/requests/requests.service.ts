import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRequestDto } from './dto/create-request.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Request } from 'src/requests/schemas/request.schema';
import { Model } from 'mongoose';
import aqp from 'api-query-params';
import { isEmpty } from 'class-validator';
import { ChangeStatusDto } from 'src/requests/dto/change-status.dto';
import { CreateCommentDto } from 'src/requests/dto/create-comment.dto';

@Injectable()
export class RequestsService {
  constructor(@InjectModel(Request.name) private requestModel: Model<Request>) { }

  async create(createRequestDto: CreateRequestDto, user: IUser) {
    return await this.requestModel.create({
      ...createRequestDto,
      createdBy: user.email,
      unit: user.unit
    })
  }

  async findAll(current: number, pageSize: number, queryString: string, user: IUser) {
    let { filter, population } = aqp(queryString)
    let { sort }: { sort: any } = aqp(queryString)
    delete filter.current
    delete filter.pageSize

    let defaultLimit = +pageSize ? +pageSize : 10
    let defaultCurrent = +current ? +current : 1
    let offset = (+defaultCurrent - 1) * (+defaultLimit)

    if (user.role === 'gv' || user.role === 'truongdv') {
      filter = {
        ...filter,
        unit: user.unit  // Gắn thêm điều kiện lọc theo unit
      };
    }
    const totalItems = await this.requestModel.countDocuments(filter)
    const totalPages = Math.ceil(totalItems / defaultLimit)
    if (isEmpty(sort)) {
      sort = { createdAt: 1 };
    }
    let devices = await this.requestModel.find(filter)
      .skip(offset)
      .limit(defaultLimit)
      .sort(sort)
      .populate(population)
      .populate({ path: 'device', select: 'name' })
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
    return await this.requestModel
      .findOne({ _id: id })
      .populate({ path: 'device', select: 'name' })
      .populate({ path: 'unit', select: 'name' })
      .exec();
  }

  async updateStatus(id: string, changeStatusDto: ChangeStatusDto) {
    return await this.requestModel.updateOne({ _id: id }, {
      status: changeStatusDto.status,
      reason: changeStatusDto?.reason ?? null
    });
  }

  async remove(id: string) {
    return await this.requestModel.deleteOne({ _id: id });
  }

  async removeMany(ids: any[]) {
    return await this.requestModel.deleteMany({ _id: { $in: ids } });
  }

  async addComment(requestId: string, dto: CreateCommentDto, user: IUser) {
    const request = await this.requestModel.findById(requestId);
    if (!request) throw new NotFoundException('Không tìm thấy đề nghị');

    // Thêm comment vào mảng
    const newComment = {
      content: dto.content,
      createdBy: user.email,
      createdAt: new Date(),
    };

    return await this.requestModel.updateOne({ _id: requestId },
      { $push: { comments: newComment } }
    );
  }
}
