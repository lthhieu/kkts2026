import { IsNotEmpty } from "class-validator";

export class CreateRoomDto {
    @IsNotEmpty({ message: "Tên không được để trống" })
    name: string;

    @IsNotEmpty({ message: "Thông tin không được để trống" })
    info: { description: string; year: number; unit: any; }[];
}