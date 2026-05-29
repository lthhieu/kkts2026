
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type NhaxuongDocument = HydratedDocument<Nhaxuong>;

@Schema({ timestamps: true })
export class Nhaxuong {
    @Prop()
    ma: string;

    @Prop()
    name: string;

    @Prop()
    dt: number;

    @Prop()
    qui_mo_cho_ngoi: number;


    @Prop({ default: 0 })
    nam_sd: number;

}

export const NhaxuongSchema = SchemaFactory.createForClass(Nhaxuong);

