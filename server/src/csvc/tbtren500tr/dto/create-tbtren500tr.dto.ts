import { IsNotEmpty, IsOptional, IsArray, IsMongoId } from "class-validator";

export class CreateTbtren500trDto {

    @IsOptional()
    code?: string;

    @IsNotEmpty({ message: 'Tên phòng không được để trống' })
    name: string;

    @IsOptional()
    description?: string;

    @IsNotEmpty({ message: 'Năm sử dụng không được để trống' })
    yearUse: number;

    @IsNotEmpty({ message: 'Đơn vị không được để trống' })
    unit: any;

    @IsOptional()
    quantity?: number;

    @IsOptional()
    originalPrice?: number;

    @IsOptional()
    note?: string;

    @IsOptional()
    @IsArray()
    @IsMongoId({ each: true })
    childrenIds?: string[];
}
