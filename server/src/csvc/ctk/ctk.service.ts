import { Injectable } from '@nestjs/common';
import { CreateCtkDto } from './dto/create-ctk.dto';
import { UpdateCtkDto } from './dto/update-ctk.dto';

@Injectable()
export class CtkService {
  create(createCtkDto: CreateCtkDto) {
    return 'This action adds a new ctk';
  }

  findAll() {
    return `This action returns all ctk`;
  }

  findOne(id: number) {
    return `This action returns a #${id} ctk`;
  }

  update(id: number, updateCtkDto: UpdateCtkDto) {
    return `This action updates a #${id} ctk`;
  }

  remove(id: number) {
    return `This action removes a #${id} ctk`;
  }
}
