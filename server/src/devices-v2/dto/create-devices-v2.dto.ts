import { IsArray, IsEnum, IsMongoId, IsNotEmpty, IsOptional } from "class-validator";
import { DeviceType, StatusType } from "src/devices-v2/schemas/devices-v2.schema";

export class CreateDevicesV2Dto {
    @IsNotEmpty({ message: "Tên không được để trống" })
    name: string;

    @IsNotEmpty({ message: "Mã số/Mô tả không được để trống" })
    description: string;

    @IsNotEmpty({ message: "Nơi sử dụng không được để trống" })
    usedLocation: { year: number; room: any; reason?: string; person?: string }[];

    @IsOptional()
    usedYear?: number;

    @IsNotEmpty({ message: "Số kế toán không được để trống" })
    soKeToan: { soLuong: number; nguyenGia: number; giaTriConLai: number | null; };

    @IsNotEmpty({ message: "Kiểm kê không được để trống" })
    kiemKe: { soLuong: number; nguyenGia: number; giaTriConLai: number | null; };

    @IsNotEmpty({ message: "Chênh lệch không được để trống" })
    chenhLech: { thua: number; thieu: number; giaTriConLai: number | null; };

    @IsNotEmpty({ message: "Chất lượng còn lại không được để trống" })
    chatLuongConLai: number;

    @IsOptional()
    note?: string;

    @IsNotEmpty({ message: "Trọng số chất lượng không được để trống" })
    trongSoChatLuong: number;

    @IsEnum(DeviceType, {
        message: 'Loại tài sản không hợp lệ',
    })
    type: DeviceType;

    @IsNotEmpty({ message: "Đơn vị không được để trống" })
    unit: any;

    @IsOptional()
    @IsArray()
    @IsMongoId({ each: true })
    childrenIds?: string[];

    @IsOptional()
    @IsEnum(StatusType, {
        message: 'Trạng thái không hợp lệ',
    })
    status?: StatusType;
}

