import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateKtxDto {
    @IsNotEmpty({ message: 'Mã KTX không được để trống' })
    ma: string;

    @IsNotEmpty({ message: 'Tên không được để trống' })
    name: string;

    @IsNotEmpty({ message: 'Diện tích không được để trống' })
    dt: number;

    @IsNotEmpty({ message: 'Sức chứa không được để trống' })
    sc: number;

    @IsNotEmpty({ message: 'Năm sử dụng không được để trống' })
    nam_sd: number;
}
