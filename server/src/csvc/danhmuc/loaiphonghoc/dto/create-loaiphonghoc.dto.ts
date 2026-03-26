import { IsNotEmpty } from "class-validator";

export class CreateLoaiphonghocDto {
    @IsNotEmpty({ message: "Tên không được để trống" })
    name: string;
}
