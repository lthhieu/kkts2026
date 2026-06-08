import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateDatdaiDto {
    @IsNotEmpty({ message: 'Mã giấy CNQSH không được để trống' })
    ma_giay_cnqsh: string;

    @IsOptional()
    thua?: number;

    @IsNotEmpty({ message: 'Diện tích không được để trống' })
    dt: number;

    @IsOptional()
    diachi?: string;

    @IsOptional()
    ghichu?: string;
}
