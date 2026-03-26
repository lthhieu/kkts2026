import { IsNotEmpty } from "class-validator";

export class CreateHinhthucsohuuDto {
    @IsNotEmpty({ message: "Tên không được để trống" })
    name: string;
}
