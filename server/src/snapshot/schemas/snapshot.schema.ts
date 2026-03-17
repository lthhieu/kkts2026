import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type SnapshotDocument = HydratedDocument<Snapshot>;

@Schema({ timestamps: true })
export class Snapshot {
    @Prop()
    year: number;

    @Prop()
    closedBy: string;

    @Prop()
    name: string;

    @Prop()
    description: string;


    @Prop()
    room: string;

    @Prop()
    usedYear: number;

    @Prop({
        type: { _id: false, soLuong: { type: Number, default: 1 }, nguyenGia: { type: Number, default: null }, giaTriConLai: { type: Number, default: null } }
    })
    soKeToan: { soLuong: number; nguyenGia: number | null; giaTriConLai: number | null; };

    @Prop({
        type: { _id: false, soLuong: { type: Number, default: 1 }, nguyenGia: { type: Number, default: null }, giaTriConLai: { type: Number, default: null } }
    })
    kiemKe: { soLuong: number; nguyenGia: number | null; giaTriConLai: number | null; };

    @Prop({
        type: { _id: false, thua: { type: Number, default: 0 }, thieu: { type: Number, default: 0 }, giaTriConLai: { type: Number, default: null } }
    })
    chenhLech: { thua: number; thieu: number; giaTriConLai: number | null; };

    @Prop()
    chatLuongConLai: number;

    @Prop()
    note: string;

    @Prop()
    trongSoChatLuong: number;

    @Prop()
    type: string;

    @Prop()
    unit: string;

    @Prop({ type: String || null, default: null })
    parent: string | null;

    @Prop({ default: 'dangsudung' })
    status: string;

    @Prop({ default: false })
    isDeleted: boolean;

    @Prop({ default: null })
    deletedAt: Date;

    @Prop({ default: null })
    deletedBy: string

}

export const SnapshotSchema = SchemaFactory.createForClass(Snapshot);