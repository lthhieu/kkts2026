import { IsNotEmpty } from "class-validator";

export class CreateHinhthucsudungDto {
    @IsNotEmpty({ message: "Tên không được để trống" })
    name: string;
}
