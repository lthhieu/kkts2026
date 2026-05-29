import { IsNotEmpty } from 'class-validator';

export class CreateThinghiemDto {
    @IsNotEmpty({ message: 'Mã phòng không được để trống' })
    ma: string;

    @IsNotEmpty({ message: 'Tên phòng không được để trống' })
    name: string;

    @IsNotEmpty({ message: 'Diện tích không được để trống' })
    dt: number;

    @IsNotEmpty({ message: 'Quy mô chỗ ngồi không được để trống' })
    qui_mo_cho_ngoi: number;


    @IsNotEmpty({ message: 'Năm sử dụng không được để trống' })
    nam_sd: number;

}
