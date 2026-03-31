import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateThuvienDto {
    @IsNotEmpty({ message: 'Mã thư viện không được để trống' })
    ma_thuvien: string;

    @IsNotEmpty({ message: 'Tên thư viện không được để trống' })
    name: string;

    @IsNotEmpty({ message: 'Năm sử dụng không được để trống' })
    nam_sd: number;

    @IsNotEmpty({ message: 'Diện tích không được để trống' })
    dt: number;

    @IsNotEmpty({ message: 'Diện tích phòng đọc không được để trống' })
    dt_phongdoc: number;

    @IsNotEmpty({ message: 'Số phòng đọc không được để trống' })
    so_phong_doc: number;

    @IsNotEmpty({ message: 'Số lượng máy tính không được để trống' })
    soluong_maytinh: number;

    @IsNotEmpty({ message: 'Số lượng chỗ ngồi đọc sách không được để trống' })
    soluong_cho_ngoi_doc_sach: number;

    @IsNotEmpty({ message: 'Số lượng sách không được để trống' })
    soluong_sach: number;

    @IsNotEmpty({ message: 'Số lượng tạp chí không được để trống' })
    soluong_tapchi: number;

    @IsNotEmpty({ message: 'Số lượng sách điện tử không được để trống' })
    soluong_sach_dien_tu: number;

    @IsNotEmpty({ message: 'Số lượng tạp chí điện tử không được để trống' })
    soluong_tapchi_dien_tu: number;

    @IsNotEmpty({ message: 'Số lượng thư viện liên kết trong nước không được để trống' })
    soluong_thu_vien_lien_ket_trong_nuoc: number;

    @IsNotEmpty({ message: 'Số lượng thư viện điện tử liên kết nước ngoài không được để trống' })
    soluong_thu_vien_dien_tu_lien_ket_nuoc_ngoai: number;

    @IsNotEmpty({ message: 'Tình trạng CSVC không được để trống' })
    tinhtrangcsvc: any;

    @IsNotEmpty({ message: 'Hình thức sở hữu không được để trống' })
    htsh: any;

    @IsNotEmpty({ message: 'Số lượng đầu sách không được để trống' })
    soluong_dau_sach: number;

    @IsNotEmpty({ message: 'Số lượng đầu tạp chí không được để trống' })
    soluong_dau_tap_chi: number;

    @IsNotEmpty({ message: 'Số lượng đầu sách điện tử không được để trống' })
    soluong_dau_sach_dien_tu: number;

    @IsNotEmpty({ message: 'Số lượng đầu tạp chí điện tử không được để trống' })
    soluong_dau_tap_chi_dien_tu: number;

    @IsOptional()
    diachi: string;

    @IsOptional()
    tinh_trang_sd: any;

    @IsOptional()
    ngay_chuyen_tt: string;

    @IsOptional()
    so_dau_sach_dien_tu_co_truy_cap_truc_tuyen: number;

    @IsOptional()
    so_dau_sach_co_ban_in: number;

    @IsOptional()
    so_dau_sach_in_co_the_muon_truc_tiep: number;
}
