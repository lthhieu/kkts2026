import { IsNotEmpty, IsOptional } from "class-validator";

export class CreateDeviceDto {
    @IsNotEmpty({ message: "Tên không được để trống" })
    name: string;

    @IsNotEmpty({ message: "Mã số/Mô tả không được để trống" })
    description: string;

    @IsNotEmpty({ message: "Nơi sử dụng không được để trống" })
    usedLocation: { year: number; room: any }[];

    @IsNotEmpty({ message: "Năm sử dụng không được để trống" })
    usedYear: number;

    @IsNotEmpty({ message: "Số kế toán không được để trống" })
    soKeToan: { soLuong: number; nguyenGia: number; giaTriConLai: number | null; };

    @IsNotEmpty({ message: "Kiểm kê không được để trống" })
    kiemKe: { soLuong: number; nguyenGia: number; giaTriConLai: number | null; };

    @IsNotEmpty({ message: "Chênh lệch không được để trống" })
    chenhLech: { thua: number; thieu: number; giaTriConLai: number | null; };

    @IsNotEmpty({ message: "Chất lượng còn lại không được để trống" })
    chatLuongConLai: number;

    @IsNotEmpty({ message: "Ghi chú không được để trống" })
    note: string;

    @IsNotEmpty({ message: "Trọng số chất lượng không được để trống" })
    trongSoChatLuong: number;

    @IsNotEmpty({ message: "Loại tài sản không được để trống" })
    type: string;

    @IsNotEmpty({ message: "Đơn vị không được để trống" })
    unit: any;

    @IsOptional()
    parent: any;
}
