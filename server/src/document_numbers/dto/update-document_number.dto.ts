import { PartialType } from '@nestjs/mapped-types';
import { CreateDocumentNumberDto } from './create-document_number.dto';

export class UpdateDocumentNumberDto extends PartialType(CreateDocumentNumberDto) {}
