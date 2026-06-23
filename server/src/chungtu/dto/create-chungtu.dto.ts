import { IsEnum, IsNotEmpty, IsOptional } from "class-validator";
import { TrangthaiChungtu } from "src/chungtu/schemas/chungtu.schema";

export class CreateChungtuDto {
    @IsNotEmpty({ message: "Nội dung không được để trống" })
    noidung: string;

    @IsNotEmpty({ message: "Ngày nhận không được để trống" })
    ngaynhan: any;
    @IsOptional()
    ngayhoanthanh?: any;

    @IsNotEmpty({ message: "Số tiền nhận không được để trống" })
    sotien: number;

    @IsNotEmpty({ message: "Tiền bằng chữ không được để trống" })
    tienbangchu: string;

    @IsEnum(TrangthaiChungtu, {
        message: 'Trạng thái chứng từ không hợp lệ',
    })
    trangthai: TrangthaiChungtu;

    @IsOptional()
    ghichu?: string;
}
