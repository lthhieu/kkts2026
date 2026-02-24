import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Room } from 'src/rooms/schemas/room.schema';
import { Unit } from 'src/units/schemas/unit.schema';

export type DeviceDocument = HydratedDocument<Device>;

@Schema({ timestamps: true })
export class Device {
    @Prop()
    name: string;

    @Prop()
    description: string;

    @Prop({
        type: [{ _id: false, year: { type: Number }, room: { type: mongoose.Schema.Types.ObjectId, ref: Room.name } }]
    })
    usedLocation: { year: number | null; room: Room | null }[];

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Room.name })
    currentRoom: Room | null;

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

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Unit.name })
    unit: Unit | null;

}

export const DeviceSchema = SchemaFactory.createForClass(Device);