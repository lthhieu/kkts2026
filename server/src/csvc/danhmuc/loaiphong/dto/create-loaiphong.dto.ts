import { IsNotEmpty } from "class-validator";

export class CreateLoaiphongDto {
    @IsNotEmpty({ message: "Tên không được để trống" })
    name: string;
}
