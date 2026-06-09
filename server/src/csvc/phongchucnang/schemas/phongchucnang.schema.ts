
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Loaiphong } from 'src/csvc/danhmuc/loaiphong/schemas/loaiphong.schema';
import { Unit } from 'src/units/schemas/unit.schema';

export type PhongchucnangDocument = HydratedDocument<Phongchucnang>;

@Schema({ timestamps: true })
export class Phongchucnang {
    @Prop()
    ma: string;

    @Prop()
    name: string;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Loaiphong.name })
    type: Loaiphong | null;

    @Prop()
    dtxd: number;

    @Prop({ default: 0 })
    nam_sd: number;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Unit.name, default: null })
    unit?: Unit | null;

}

export const PhongchucnangSchema = SchemaFactory.createForClass(Phongchucnang);

