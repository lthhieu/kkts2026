import { IsNotEmpty } from 'class-validator';

export class CreateThuvienDto {
    @IsNotEmpty({ message: 'Mã phòng không được để trống' })
    ma: string;

    @IsNotEmpty({ message: 'Tên phòng không được để trống' })
    name: string;

    @IsNotEmpty({ message: 'Năm sử dụng không được để trống' })
    nam_sd: number;

    @IsNotEmpty({ message: 'Diện tích không được để trống' })
    dt: number;

}
