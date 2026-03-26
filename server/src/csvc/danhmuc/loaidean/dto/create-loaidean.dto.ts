import { IsNotEmpty } from "class-validator";

export class CreateLoaideanDto {
    @IsNotEmpty({ message: "Tên không được để trống" })
    name: string;
}
