import { IsNotEmpty } from "class-validator";

export class CreateTinhtrangsudungDto {
    @IsNotEmpty({ message: "Tên không được để trống" })
    name: string;
}
