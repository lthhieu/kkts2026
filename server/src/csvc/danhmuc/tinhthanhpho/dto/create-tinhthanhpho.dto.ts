import { IsNotEmpty } from "class-validator";

export class CreateTinhthanhphoDto {
    @IsNotEmpty({ message: "Tên không được để trống" })
    name: string;
}
