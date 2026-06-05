import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Room } from 'src/rooms/schemas/room.schema';
import { Unit } from 'src/units/schemas/unit.schema';

export type MaytoantruongDocument = HydratedDocument<Maytoantruong>;

export enum MayCate {
    MAY_CAU_HINH_CAO = 'maycauhinhcao',
    LAPTOP_MAY_TINH_BANG = 'laptopmaytinhbang',
    TUONG_DUONG_THAP = 'tuongduongthap',
    MAY_IN = 'mayin',
    MAY_SCAN = 'mayscan',
}

@Schema({ timestamps: true })
export class Maytoantruong {
    @Prop()
    name: string;

    @Prop()
    des: string;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Unit.name })
    unit: Unit | null;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Room.name })
    room: Room | null;

    @Prop()
    nam_sd: number;

    @Prop()
    sl: number;

    @Prop()
    nguyengia: number;

    @Prop({
        type: String,
        enum: MayCate,
        required: true,
    })
    cate: MayCate;

}

export const MaytoantruongSchema = SchemaFactory.createForClass(Maytoantruong);


