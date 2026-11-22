import { ConflictException, Injectable } from '@nestjs/common';
import { CreateDocumentNumberDto } from './dto/create-document_number.dto';
import { UpdateDocumentNumberDto } from './dto/update-document_number.dto';
import { InjectModel } from '@nestjs/mongoose';
import { DocumentNumber } from 'src/document_numbers/schemas/document_number.schema';
import { Model } from 'mongoose';
import aqp from 'api-query-params';
import { isEmpty } from 'class-validator';

@Injectable()
export class DocumentNumbersService {
  constructor(@InjectModel(DocumentNumber.name) private documentNumberModel: Model<DocumentNumber>) { }
  async create(createDocumentNumberDto: CreateDocumentNumberDto, user: IUser) {
    try {
      // Thực hiện lưu vào database
      const newDoc = await this.documentNumberModel.create({
        ...createDocumentNumberDto,
        creator: user
      });

      return newDoc;

    } catch (error: any) {
      // Mã 11000 là lỗi vi phạm Unique Index của MongoDB
      if (error.code === 11000) {
        throw new ConflictException(
          `Số ${createDocumentNumberDto.number} cho loại ${createDocumentNumberDto.type} trong năm ${createDocumentNumberDto.year} đã tồn tại. Vui lòng chọn số khác!`
        );
      }

      // Nếu là các lỗi khác (ví dụ rớt mạng, lỗi DB), quăng lỗi ra cho NestJS xử lý
      throw error;
    }
  }

  async createMany(createDocumentNumberDto: CreateDocumentNumberDto[]) {
    try {
      // insertMany accepts an array of plain JavaScript objects
      const createdDocumentNumbers = await this.documentNumberModel.insertMany(createDocumentNumberDto, { ordered: true });
      return createdDocumentNumbers;
    } catch (error: any) {
      if (error.code === 11000) {
        throw new ConflictException(
          `Một hoặc nhiều số trong danh sách đã tồn tại trong hệ thống (vi phạm Unique Index). Vui lòng kiểm tra lại!`
        );
      }
      throw error;
    }
  }

  async findAll(current: number, pageSize: number, queryString: string) {
    let { filter, population } = aqp(queryString)
    let { sort }: { sort: any } = aqp(queryString)
    delete filter.current
    delete filter.pageSize
    let defaultLimit = +pageSize ? +pageSize : 10
    let defaultCurrent = +current ? +current : 1
    let offset = (+defaultCurrent - 1) * (+defaultLimit)
    const totalItems = await this.documentNumberModel.countDocuments(filter)
    const totalPages = Math.ceil(totalItems / defaultLimit)
    if (isEmpty(sort)) {
      sort = "issue_date"
    }
    let documentsNumber = await this.documentNumberModel.find(filter)
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
      result: documentsNumber
    }
  }

  async findOne(id: string) {
    return await this.documentNumberModel.findOne({ _id: id });
  }

  async update(id: string, updateDocumentNumberDto: UpdateDocumentNumberDto) {
    return await this.documentNumberModel.updateOne({ _id: id }, updateDocumentNumberDto);
  }

  async remove(id: string) {
    // throw new Error('Method not implemented.');
    return await this.documentNumberModel.deleteOne({ _id: id });
  }

  async removeMany(ids: any[]) {
    return await this.documentNumberModel.deleteMany({ _id: { $in: ids } });
  }

  async exportAll() {
    return await this.documentNumberModel.find().lean();
  }
}
