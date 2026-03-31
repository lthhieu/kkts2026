import { IsNotEmpty } from 'class-validator';

export class CreateXthDto {
    @IsNotEmpty({ message: 'Mã công trình CSVC không được để trống' })
    ma_ct_csvc: any;

    @IsNotEmpty({ message: 'Phục vụ ngành không được để trống' })
    phuc_vu_nganh: any;

    @IsNotEmpty({ message: 'Mức độ đáp ứng nhu cầu NCKH không được để trống' })
    muc_do_dap_ung_nhu_cau_nckh: string;

    @IsNotEmpty({ message: 'Năm sử dụng không được để trống' })
    nam_sd: number;
}
