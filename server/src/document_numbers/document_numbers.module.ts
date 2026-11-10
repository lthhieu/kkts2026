import { Module } from '@nestjs/common';
import { DocumentNumbersService } from './document_numbers.service';
import { DocumentNumbersController } from './document_numbers.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { CaslModule } from 'src/casl/casl.module';
import { DocumentNumber, DocumentNumberSchema } from 'src/document_numbers/schemas/document_number.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: DocumentNumber.name, schema: DocumentNumberSchema }]), CaslModule],
  controllers: [DocumentNumbersController],
  providers: [DocumentNumbersService],
})
export class DocumentNumbersModule { }