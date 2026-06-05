import { IsNotEmpty } from 'class-validator';

export class CreateCholamvieccuagvDto {
    @IsNotEmpty({ message: 'Mã phòng không được để trống' })
    ma: string;

    @IsNotEmpty({ message: 'Tên phòng không được để trống' })
    name: string;

    @IsNotEmpty({ message: 'Diện tích không được để trống' })
    dt: number;

}
