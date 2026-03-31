import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateTbiptnDto {
    @IsNotEmpty({ message: 'Mã thiết bị không được để trống' })
    ma_tb: string;

    @IsNotEmpty({ message: 'Mã công trình CSVC không được để trống' })
    ma_ct_csvc: any;

    @IsNotEmpty({ message: 'Tên thiết bị không được để trống' })
    ten_tb: string;

    @IsNotEmpty({ message: 'Năm sản xuất không được để trống' })
    nam_sx: number;

    @IsNotEmpty({ message: 'Xuất xứ không được để trống' })
    xuatxu: any;

    @IsNotEmpty({ message: 'Hãng sản xuất không được để trống' })
    hang_sx: string;

    @IsNotEmpty({ message: 'Số lượng TB cùng loại không được để trống' })
    sl_tb_cungloai: number;

    @IsNotEmpty({ message: 'Năm sử dụng không được để trống' })
    nam_sd: number;
    @IsOptional()
    tinh_trang_sd?: any;

    @IsOptional()
    ngay_chuyen_tt?: string;
}
