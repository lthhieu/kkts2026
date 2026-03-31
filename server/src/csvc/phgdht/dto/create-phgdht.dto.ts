import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreatePhgdhtDto {
    @IsNotEmpty({ message: 'Mã phòng không được để trống' })
    ma_phgdht: string;

    @IsNotEmpty({ message: 'Tên phòng không được để trống' })
    name: string;

    @IsNotEmpty({ message: 'Diện tích không được để trống' })
    dt: number;

    @IsNotEmpty({ message: 'Hình thức sở hữu không được để trống' })
    htsh: any;

    @IsNotEmpty({ message: 'Quy mô chỗ ngồi không được để trống' })
    qui_mo_cho_ngoi: number;

    @IsNotEmpty({ message: 'Tình trạng CSVC không được để trống' })
    tinhtrangcsvc: any;

    @IsNotEmpty({ message: 'Phân loại không được để trống' })
    phanloai: any;

    @IsNotEmpty({ message: 'Loại phòng học không được để trống' })
    loaiphonghoc: any;

    @IsNotEmpty({ message: 'Loại đề án không được để trống' })
    loaidean: any;

    @IsNotEmpty({ message: 'Năm sử dụng không được để trống' })
    nam_sd: number;

    @IsNotEmpty({ message: 'Địa chỉ không được để trống' })
    diachi: string;

    @IsOptional()
    tinh_trang_sd?: any;

    @IsOptional()
    ngay_chuyen_tt?: string;
}
