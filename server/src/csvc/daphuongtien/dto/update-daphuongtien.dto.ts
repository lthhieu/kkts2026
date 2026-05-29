import { PartialType } from '@nestjs/mapped-types';
import { CreateDaphuongtienDto } from 'src/csvc/daphuongtien/dto/create-daphuongtien.dto';

export class UpdateDaphuongtienDto extends PartialType(CreateDaphuongtienDto) { }
