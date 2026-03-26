import { IsNotEmpty } from "class-validator";

export class CreateLoaicongtrinhcsvcDto {
    @IsNotEmpty({ message: "Tên không được để trống" })
    name: string;
}
