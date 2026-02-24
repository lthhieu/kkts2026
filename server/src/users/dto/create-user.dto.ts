import { IsNotEmpty } from "class-validator";

export class CreateUserDto {
    @IsNotEmpty({ message: "Tên không được để trống" })
    name: string;
    @IsNotEmpty({ message: "Email không được để trống" })
    email: string;
    @IsNotEmpty({ message: "Mật khẩu không được để trống" })
    password: string;
    @IsNotEmpty({ message: "Đơn vị không được để trống" })
    unit: any;
    @IsNotEmpty({ message: "Quyền hạn không được để trống" })
    role: string;

}
