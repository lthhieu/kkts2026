import { IsNotEmpty } from "class-validator";

export class CreatePhanloaiDto {
    @IsNotEmpty({ message: "Tên không được để trống" })
    name: string;
}
