import { IsNotEmpty } from "class-validator";

export class CreateLuachonDto {
    @IsNotEmpty({ message: "Tên không được để trống" })
    name: string;
}
