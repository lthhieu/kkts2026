import { IsNotEmpty, IsOptional } from "class-validator";

export class CreateRequestDto {
    @IsNotEmpty({ message: "Tên đề nghị không được để trống" })
    name: string;

    @IsNotEmpty({ message: "Loại đề nghị không được để trống" })
    type: string;

    @IsNotEmpty({ message: "Mã thiết bị không được để trống" })
    device: any;

    @IsNotEmpty({ message: "Mô tả đề nghị không được để trống" })
    description: string;

    @IsOptional()
    image: string;
}
