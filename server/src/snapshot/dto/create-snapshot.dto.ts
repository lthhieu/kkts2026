import { IsNotEmpty } from "class-validator";

export class CreateSnapshotDto {
    @IsNotEmpty({ message: 'Năm kết sổ không được để trống' })
    year: number;
}
