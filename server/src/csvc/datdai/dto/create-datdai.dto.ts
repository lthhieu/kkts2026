import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateDatdaiDto {
    @IsNotEmpty({ message: 'Mã giấy CNQSH không được để trống' })
    ma_giay_cnqsh: string;

    @IsNotEmpty({ message: 'Diện tích không được để trống' })
    dt: number;

    @IsNotEmpty({ message: 'Hình thức sử dụng không được để trống' })
    htsd: any;

    @IsNotEmpty({ message: 'Cơ quan sở hữu không được để trống' })
    cqsh: string;

    @IsNotEmpty({ message: 'Minh chứng QSHD không được để trống' })
    minh_chung_qshd: string;

    @IsOptional()
    muc_dich_shd?: any;

    @IsNotEmpty({ message: 'Năm bắt đầu SDD không được để trống' })
    nam_bd_sdd: number;

    @IsNotEmpty({ message: 'Thời gian SDD không được để trống' })
    tg_sdd: number;

    @IsNotEmpty({ message: 'Diện tích đất đã SD không được để trống' })
    dtd_da_sd: number;

    @IsOptional()
    tinh_trang_sd?: any;

    @IsOptional()
    ngay_chuyen_tt?: string;

    @IsNotEmpty({ message: 'Tỉnh thành phố không được để trống' })
    tinhthanhpho: any;

    @IsNotEmpty({ message: 'Xã phường không được để trống' })
    xaphuong: any;

    @IsOptional()
    diachi?: string;
}
