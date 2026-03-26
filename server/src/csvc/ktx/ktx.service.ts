import { Injectable } from '@nestjs/common';
import { CreateKtxDto } from './dto/create-ktx.dto';
import { UpdateKtxDto } from './dto/update-ktx.dto';

@Injectable()
export class KtxService {
  create(createKtxDto: CreateKtxDto) {
    return 'This action adds a new ktx';
  }

  findAll() {
    return `This action returns all ktx`;
  }

  findOne(id: number) {
    return `This action returns a #${id} ktx`;
  }

  update(id: number, updateKtxDto: UpdateKtxDto) {
    return `This action updates a #${id} ktx`;
  }

  remove(id: number) {
    return `This action removes a #${id} ktx`;
  }
}
