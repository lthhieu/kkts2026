import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from 'src/users/schemas/user.schema';

export type ChungtuDocument = HydratedDocument<Chungtu>;

export enum TrangthaiChungtu {
    CHUAXACDINH = 'Chưa xác định',
    CHUASCAN = 'Đã thanh toán nhưng chưa scan',
    DATHANHTOAN = 'Đã thanh toán',
    THANHTOAN1PHAN = 'Thanh toán một phần'
}

@Schema({ timestamps: true })
export class Chungtu {
    @Prop()
    noidung: string;

    @Prop()
    ngaynhan: Date;

    @Prop({ type: Date, default: null })
    ngayhoanthanh: Date | null;

    @Prop()
    sotien: number;

    @Prop()
    tienbangchu: string;

    @Prop({ type: String, enum: TrangthaiChungtu, default: TrangthaiChungtu.CHUAXACDINH })
    trangthai: TrangthaiChungtu;

    @Prop()
    ghichu: string;
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name, default: null })
    user?: User | null;

}

export const ChungtuSchema = SchemaFactory.createForClass(Chungtu);