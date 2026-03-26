import { IsNotEmpty } from "class-validator";

export class CreateLinhvucdaotaoDto {
    @IsNotEmpty({ message: "Tên không được để trống" })
    name: string;
}
