import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ToanhaDocument = HydratedDocument<Toanha>;

@Schema({ timestamps: true })
export class Toanha {
    @Prop()
    ma_toanha: string;

    @Prop()
    ten_toanha: string;

    @Prop()
    dtxd: number;

    @Prop()
    tong_dt_sxd: number;

    @Prop()
    so_tang: number;

    @Prop()
    nam_sd: number;

    @Prop({ default: 0 })
    place: number;

}

export const ToanhaSchema = SchemaFactory.createForClass(Toanha);

