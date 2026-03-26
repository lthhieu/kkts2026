import { Injectable } from '@nestjs/common';
import { CreatePhgdhtDto } from './dto/create-phgdht.dto';
import { UpdatePhgdhtDto } from './dto/update-phgdht.dto';

@Injectable()
export class PhgdhtService {
  create(createPhgdhtDto: CreatePhgdhtDto) {
    return 'This action adds a new phgdht';
  }

  findAll() {
    return `This action returns all phgdht`;
  }

  findOne(id: number) {
    return `This action returns a #${id} phgdht`;
  }

  update(id: number, updatePhgdhtDto: UpdatePhgdhtDto) {
    return `This action updates a #${id} phgdht`;
  }

  remove(id: number) {
    return `This action removes a #${id} phgdht`;
  }
}
