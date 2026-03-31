import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateKtxDto {
    @IsNotEmpty({ message: 'Mã KTX không được để trống' })
    ma_ktx: string;

    @IsNotEmpty({ message: 'Hình thức sở hữu không được để trống' })
    htsh: any;

    @IsNotEmpty({ message: 'Tổng số chỗ ở không được để trống' })
    tong_so_cho_o: number;

    @IsNotEmpty({ message: 'Tổng diện tích không được để trống' })
    tong_dt: number;

    @IsNotEmpty({ message: 'Tình trạng CSVC không được để trống' })
    tinhtrangcsvc: any;

    @IsNotEmpty({ message: 'Tổng số phòng ở SV không được để trống' })
    tong_so_phong_o_sv: number;

    @IsNotEmpty({ message: 'Năm sử dụng không được để trống' })
    nam_sd: number;

    @IsNotEmpty({ message: 'Địa chỉ không được để trống' })
    diachi: string;

    @IsOptional()
    tinh_trang_sd?: any;

    @IsOptional()
    ngay_chuyen_tt?: string;
}
