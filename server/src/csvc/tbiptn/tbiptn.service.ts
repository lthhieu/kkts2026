import { Injectable } from '@nestjs/common';
import { CreateTbiptnDto } from './dto/create-tbiptn.dto';
import { UpdateTbiptnDto } from './dto/update-tbiptn.dto';

@Injectable()
export class TbiptnService {
  create(createTbiptnDto: CreateTbiptnDto) {
    return 'This action adds a new tbiptn';
  }

  findAll() {
    return `This action returns all tbiptn`;
  }

  findOne(id: number) {
    return `This action returns a #${id} tbiptn`;
  }

  update(id: number, updateTbiptnDto: UpdateTbiptnDto) {
    return `This action updates a #${id} tbiptn`;
  }

  remove(id: number) {
    return `This action removes a #${id} tbiptn`;
  }
}
