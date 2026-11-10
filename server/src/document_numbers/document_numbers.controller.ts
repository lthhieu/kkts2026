import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { DocumentNumbersService } from './document_numbers.service';
import { CreateDocumentNumberDto } from './dto/create-document_number.dto';
import { UpdateDocumentNumberDto } from './dto/update-document_number.dto';
import { PoliciesGuard } from 'src/configs/casl.policies.guard';
import { CheckPolicies, ResponseMessage, User } from 'src/configs/my.decorator';
import { AppAbility } from 'src/casl/casl-ability.factory/casl-ability.factory';
import { Action, DocumentNumbersSubject } from 'src/configs/enum';

@UseGuards(PoliciesGuard)
@Controller('document-numbers')
export class DocumentNumbersController {
  constructor(private readonly documentNumbersService: DocumentNumbersService) { }

  @Post()
  @ResponseMessage('Tạo số văn bản thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Create, DocumentNumbersSubject))
  create(@Body() createDocumentNumberDto: CreateDocumentNumberDto, @User() user: IUser) {
    return this.documentNumbersService.create(createDocumentNumberDto, user);
  }

  @Get()
  findAll() {
    return this.documentNumbersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.documentNumbersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDocumentNumberDto: UpdateDocumentNumberDto) {
    return this.documentNumbersService.update(+id, updateDocumentNumberDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.documentNumbersService.remove(+id);
  }
}
