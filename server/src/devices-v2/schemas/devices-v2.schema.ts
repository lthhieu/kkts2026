import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Room } from 'src/rooms/schemas/room.schema';
import { Unit } from 'src/units/schemas/unit.schema';

export type DevicesV2Document = HydratedDocument<DevicesV2>;

export enum DeviceType {
    CCDC = 'Công cụ dụng cụ',
    TSCD = 'Tài sản cố định',
    SKIEG = 'Dự án Skeig',
}

export enum StatusType {
    DANGSUDUNG = 'dangsudung',
    HUHONG = 'huhong',
    THANHLY = 'thanhly',
}

@Schema({ timestamps: true })
export class DevicesV2 {
    @Prop()
    name: string;

    @Prop()
    description: string;

    @Prop({
        type: [{ _id: false, year: { type: Number }, room: { type: [{ type: mongoose.Schema.Types.ObjectId, ref: Room.name }] }, reason: { type: String }, person: { type: String } }]
    })
    usedLocation: { year: number | null; room: Room[] | null; reason?: string; person?: string }[];

    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: Room.name }] })
    currentRoom: Room[] | null;

    @Prop({ type: Number, required: false })
    usedYear: number | null;

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

    @Prop({ type: String, required: false })
    note: string | null;

    @Prop()
    trongSoChatLuong: number;

    @Prop({ type: String, enum: DeviceType, default: DeviceType.CCDC })
    type: DeviceType;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Unit.name })
    unit: Unit | null;

    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        ref: DevicesV2.name,
        default: null,
    })
    parentId: DevicesV2 | null;

    @Prop({ type: String, enum: StatusType, default: StatusType.DANGSUDUNG })
    status: StatusType;
}

export const DevicesV2Schema = SchemaFactory.createForClass(DevicesV2);

