import { IsNotEmpty } from "class-validator";

export class CreateCountryDto {
    @IsNotEmpty({ message: "Tên không được để trống" })
    name: string;
}
