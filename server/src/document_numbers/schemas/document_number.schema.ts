import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from 'src/users/schemas/user.schema';

export type DocumentNumberDocument = HydratedDocument<DocumentNumber>;
export enum TypeDocumentNumber {
    TOTRINH = 'Tờ trình',
    THAMDINH = 'Thẩm định',
    MAU08A = 'Mẫu 08a',
    DENGHI = 'Đề nghị',
    BBHH = 'Biên bản hư hỏng',
    BC = 'Báo cáo',
}

@Schema({ timestamps: true })
export class DocumentNumber {
    @Prop({ type: String, enum: TypeDocumentNumber, default: TypeDocumentNumber.TOTRINH })
    type: TypeDocumentNumber;
    @Prop()
    year: number;
    @Prop()
    number: number;
    @Prop({ type: Date, default: null })
    issue_date: Date | null;
    @Prop()
    content: string;
    @Prop({ default: 0 })
    money: number;
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
    creator: User | null;
}

export const DocumentNumberSchema = SchemaFactory.createForClass(DocumentNumber);
// BẮT BUỘC: Tạo Compound Unique Index để chống trùng lặp số theo năm và loại
DocumentNumberSchema.index({ type: 1, year: 1, number: 1 }, { unique: true });