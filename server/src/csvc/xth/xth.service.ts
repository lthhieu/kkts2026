import { Injectable } from '@nestjs/common';
import { CreateXthDto } from './dto/create-xth.dto';
import { UpdateXthDto } from './dto/update-xth.dto';

@Injectable()
export class XthService {
  create(createXthDto: CreateXthDto) {
    return 'This action adds a new xth';
  }

  findAll() {
    return `This action returns all xth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} xth`;
  }

  update(id: number, updateXthDto: UpdateXthDto) {
    return `This action updates a #${id} xth`;
  }

  remove(id: number) {
    return `This action removes a #${id} xth`;
  }
}
