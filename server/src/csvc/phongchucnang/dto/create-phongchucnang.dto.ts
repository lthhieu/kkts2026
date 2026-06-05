import { IsNotEmpty } from 'class-validator';

export class CreatePhongchucnangDto {
    @IsNotEmpty({ message: 'Mã phòng không được để trống' })
    ma: string;

    @IsNotEmpty({ message: 'Tên phòng không được để trống' })
    name: string;

    @IsNotEmpty({ message: 'Diện tích không được để trống' })
    dtxd: number;

    @IsNotEmpty({ message: 'Loại phòng không được để trống' })
    type: any;

    @IsNotEmpty({ message: 'Năm sử dụng không được để trống' })
    nam_sd: number;

}
