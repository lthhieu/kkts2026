import { ConflictException, Injectable } from '@nestjs/common';
import { CreateDocumentNumberDto } from './dto/create-document_number.dto';
import { UpdateDocumentNumberDto } from './dto/update-document_number.dto';
import { InjectModel } from '@nestjs/mongoose';
import { DocumentNumber } from 'src/document_numbers/schemas/document_number.schema';
import { Model } from 'mongoose';

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

  findAll() {
    return `This action returns all documentNumbers`;
  }

  findOne(id: number) {
    return `This action returns a #${id} documentNumber`;
  }

  update(id: number, updateDocumentNumberDto: UpdateDocumentNumberDto) {
    return `This action updates a #${id} documentNumber`;
  }

  remove(id: number) {
    return `This action removes a #${id} documentNumber`;
  }
}
