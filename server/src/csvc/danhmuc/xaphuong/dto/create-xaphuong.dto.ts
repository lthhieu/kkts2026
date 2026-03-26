import { IsNotEmpty } from "class-validator";

export class CreateXaphuongDto {
    @IsNotEmpty({ message: "Tên không được để trống" })
    name: string;
    @IsNotEmpty({ message: "Tỉnh thành phố không được để trống" })
    tinhthanhpho: any;
}
