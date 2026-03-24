import { IsNotEmpty } from "class-validator";

export class CreateNewsDto {
    @IsNotEmpty({ message: "Tiêu đề không được để trống" })
    title: string;
    @IsNotEmpty({ message: "Slug không được để trống" })
    slug: string;
    @IsNotEmpty({ message: "Nội dung không được để trống" })
    content: string;
    @IsNotEmpty({ message: "Ảnh bìa không được để trống" })
    thumbnail: string;
    @IsNotEmpty({ message: "Loại không được để trống" })
    category: string;
    @IsNotEmpty({ message: "Ngày đăng không được để trống" })
    postedAt: string;
}
