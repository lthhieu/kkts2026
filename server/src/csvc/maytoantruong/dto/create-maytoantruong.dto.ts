import { IsEnum, IsNotEmpty, IsOptional } from "class-validator";
import { MayCate } from "src/csvc/maytoantruong/schemas/maytoantruong.schema";

export class CreateMaytoantruongDto {
    @IsNotEmpty({ message: "Tên không được để trống" })
    name: string;


    @IsNotEmpty({ message: "Mã số / Mô tả không được để trống" })
    des: string;

    @IsOptional()
    unit?: any;

    @IsOptional()
    room?: any;

    @IsNotEmpty({ message: "Năm sử dụng không được để trống" })
    nam_sd: number;

    @IsNotEmpty({ message: "Số lượng không được để trống" })
    sl: number;

    @IsNotEmpty({ message: "Nguyên giá không được để trống" })
    nguyengia: number;

    @IsNotEmpty({ message: "Loại tài sản không được để trống" })
    @IsEnum(MayCate, {
        message: 'Loại máy không hợp lệ',
    })
    cate: MayCate;
}
