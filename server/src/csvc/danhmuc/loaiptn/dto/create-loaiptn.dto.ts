import { IsNotEmpty } from "class-validator";

export class CreateLoaiptnDto {
    @IsNotEmpty({ message: "Tên không được để trống" })
    name: string;
}
