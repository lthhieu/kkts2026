import { IsNotEmpty } from "class-validator";

export class CreateNccDto {
    @IsNotEmpty({ message: "Tên không được để trống" })
    name: string;
}
