import { PartialType } from '@nestjs/mapped-types';
import { CreateLinhvucdaotaoDto } from './create-linhvucdaotao.dto';

export class UpdateLinhvucdaotaoDto extends PartialType(CreateLinhvucdaotaoDto) {}
