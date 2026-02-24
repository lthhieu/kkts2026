import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Unit } from 'src/units/schemas/unit.schema';

export type RoomDocument = HydratedDocument<Room>;

@Schema({ timestamps: true })
export class Room {
    @Prop()
    name: string;

    @Prop({
        type: [{ _id: false, description: { type: String }, year: { type: Number, default: null }, unit: { type: mongoose.Schema.Types.ObjectId, ref: Unit.name } }]
    })
    info: { description: string; year: number | null; unit: Unit | null; }[];

    @Prop()
    currentDescription: string;

    @Prop()
    currentYear: number;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Unit.name })
    currentUnit: Unit | null;

}

export const RoomSchema = SchemaFactory.createForClass(Room);