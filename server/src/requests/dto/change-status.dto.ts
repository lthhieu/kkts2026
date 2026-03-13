import { IsNotEmpty, IsOptional } from "class-validator";

export class ChangeStatusDto {
    @IsNotEmpty({ message: "Trạng thái không được để trống" })
    status: string;

    @IsOptional()
    reason?: string;

}
