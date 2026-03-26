import { IsNotEmpty } from "class-validator";

export class CreateTinhtrangcsvcDto {
    @IsNotEmpty({ message: "Tên không được để trống" })
    name: string;
}
