import { Injectable } from '@nestjs/common';
import { CreateToanhaDto } from './dto/create-toanha.dto';
import { UpdateToanhaDto } from './dto/update-toanha.dto';

@Injectable()
export class ToanhaService {
  create(createToanhaDto: CreateToanhaDto) {
    return 'This action adds a new toanha';
  }

  findAll() {
    return `This action returns all toanha`;
  }

  findOne(id: number) {
    return `This action returns a #${id} toanha`;
  }

  update(id: number, updateToanhaDto: UpdateToanhaDto) {
    return `This action updates a #${id} toanha`;
  }

  remove(id: number) {
    return `This action removes a #${id} toanha`;
  }
}
