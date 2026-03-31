import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateToanhaDto {
    @IsNotEmpty({ message: 'Mã toà nhà không được để trống' })
    ma_toanha: string;

    @IsNotEmpty({ message: 'Tên toà nhà không được để trống' })
    ten_toanha: string;

    @IsNotEmpty({ message: 'Diện tích xây dựng không được để trống' })
    dtxd: number;

    @IsNotEmpty({ message: 'Tổng diện tích sàn XD không được để trống' })
    tong_dt_sxd: number;

    @IsNotEmpty({ message: 'Số tầng không được để trống' })
    so_tang: number;

    @IsNotEmpty({ message: 'Năm sử dụng không được để trống' })
    nam_sd: number;

    @IsNotEmpty({ message: 'Hình thức sở hữu không được để trống' })
    htsh: any;

    @IsNotEmpty({ message: 'Địa chỉ không được để trống' })
    diachi: string;

    @IsOptional()
    tinh_trang_sd?: any;

    @IsOptional()
    ngay_chuyen_tt?: string;
}
