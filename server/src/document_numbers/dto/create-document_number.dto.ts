import { IsEnum, IsNotEmpty } from "class-validator";
import { TypeDocumentNumber } from "src/document_numbers/schemas/document_number.schema";

export class CreateDocumentNumberDto {
    @IsNotEmpty({ message: 'Loại văn bản không được để trống' })
    @IsEnum(TypeDocumentNumber, { message: 'Loại văn bản không hợp lệ' })
    type: TypeDocumentNumber;

    @IsNotEmpty({ message: 'Năm cấp số không được để trống' })
    year: number;

    @IsNotEmpty({ message: 'Số văn bản không được để trống' })
    number: number;

    @IsNotEmpty({ message: 'Nội dung không được để trống' })
    content: string;

    @IsNotEmpty({ message: "Ngày cấp số không được để trống" })
    issue_date: any;
}
