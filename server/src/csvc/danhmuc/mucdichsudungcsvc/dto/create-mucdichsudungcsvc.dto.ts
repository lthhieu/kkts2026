import { IsNotEmpty } from "class-validator";

export class CreateMucdichsudungcsvcDto {
    @IsNotEmpty({ message: "Tên không được để trống" })
    name: string;
}
