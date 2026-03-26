import { IsNotEmpty } from "class-validator";

export class CreateMucdichsudungdatDto {
    @IsNotEmpty({ message: "Tên không được để trống" })
    name: string;
}
