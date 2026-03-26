import { Injectable } from '@nestjs/common';
import { CreatePtnDto } from './dto/create-ptn.dto';
import { UpdatePtnDto } from './dto/update-ptn.dto';

@Injectable()
export class PtnService {
  create(createPtnDto: CreatePtnDto) {
    return 'This action adds a new ptn';
  }

  findAll() {
    return `This action returns all ptn`;
  }

  findOne(id: number) {
    return `This action returns a #${id} ptn`;
  }

  update(id: number, updatePtnDto: UpdatePtnDto) {
    return `This action updates a #${id} ptn`;
  }

  remove(id: number) {
    return `This action removes a #${id} ptn`;
  }
}
