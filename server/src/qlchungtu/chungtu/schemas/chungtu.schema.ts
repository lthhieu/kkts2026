import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Ncc } from 'src/qlchungtu/ncc/schemas/ncc.schema';
import { User } from 'src/users/schemas/user.schema';

export type ChungtuDocument = HydratedDocument<Chungtu>;

export enum TrangthaiChungtu {
    DANHAN = 'Đã nhận',
    DADUYETTHANHTOAN = 'Đã duyệt thanh toán',
    DATHANHTOAN = 'Đã thanh toán',
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

    @Prop({ type: String, enum: TrangthaiChungtu, default: TrangthaiChungtu.DANHAN })
    trangthai: TrangthaiChungtu;

    @Prop()
    ghichu: string;
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name, default: null })
    user?: User | null;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name, default: null })
    updatedBy?: User | null;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Ncc.name, default: null })
    ncc: Ncc | null;

}

export const ChungtuSchema = SchemaFactory.createForClass(Chungtu);