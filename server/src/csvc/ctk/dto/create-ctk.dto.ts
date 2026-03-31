import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateCtkDto {
    @IsNotEmpty({ message: 'Mã công trình không được để trống' })
    ma_ct: string;

    @IsNotEmpty({ message: 'Tên công trình không được để trống' })
    ten_ct: string;

    @IsNotEmpty({ message: 'Loại công trình CSVC không được để trống' })
    loaicongtrinhcsvc: any;

    @IsNotEmpty({ message: 'Mục đích sử dụng CSVC không được để trống' })
    mucdichsudungcsvc: any;

    @IsNotEmpty({ message: 'Đối tượng sử dụng không được để trống' })
    doi_tuong_sd: string;

    @IsNotEmpty({ message: 'Diện tích sàn XD không được để trống' })
    dt_sxd: number;

    @IsOptional()
    von_bd?: number;

    @IsOptional()
    von_dt?: number;

    @IsNotEmpty({ message: 'Tình trạng CSVC không được để trống' })
    tinhtrangcsvc: any;

    @IsOptional()
    htsh: any;

    @IsNotEmpty({ message: 'CT CSVC trong nhà không được để trống' })
    ct_csvc_trongnha: any;

    @IsOptional()
    so_phong_o_cong_vu_cho_cb_giangday?: number;

    @IsOptional()
    so_cho_o_cho_cb_giangday?: number;

    @IsNotEmpty({ message: 'Năm sử dụng không được để trống' })
    nam_sd: number;

    @IsNotEmpty({ message: 'Địa chỉ không được để trống' })
    diachi: string;

    @IsOptional()
    tinh_trang_sd?: any;

    @IsOptional()
    ngay_chuyen_tt?: string;
}
