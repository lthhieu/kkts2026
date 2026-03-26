import { Injectable } from '@nestjs/common';
import { CreateThuvienDto } from './dto/create-thuvien.dto';
import { UpdateThuvienDto } from './dto/update-thuvien.dto';

@Injectable()
export class ThuvienService {
  create(createThuvienDto: CreateThuvienDto) {
    return 'This action adds a new thuvien';
  }

  findAll() {
    return `This action returns all thuvien`;
  }

  findOne(id: number) {
    return `This action returns a #${id} thuvien`;
  }

  update(id: number, updateThuvienDto: UpdateThuvienDto) {
    return `This action updates a #${id} thuvien`;
  }

  remove(id: number) {
    return `This action removes a #${id} thuvien`;
  }
}
