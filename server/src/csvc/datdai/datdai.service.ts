import { Injectable } from '@nestjs/common';
import { CreateDatdaiDto } from './dto/create-datdai.dto';
import { UpdateDatdaiDto } from './dto/update-datdai.dto';

@Injectable()
export class DatdaiService {
  create(createDatdaiDto: CreateDatdaiDto) {
    return 'This action adds a new datdai';
  }

  findAll() {
    return `This action returns all datdai`;
  }

  findOne(id: number) {
    return `This action returns a #${id} datdai`;
  }

  update(id: number, updateDatdaiDto: UpdateDatdaiDto) {
    return `This action updates a #${id} datdai`;
  }

  remove(id: number) {
    return `This action removes a #${id} datdai`;
  }
}
