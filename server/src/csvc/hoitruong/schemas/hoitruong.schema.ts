
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type HoitruongDocument = HydratedDocument<Hoitruong>;

@Schema({ timestamps: true })
export class Hoitruong {
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

export const HoitruongSchema = SchemaFactory.createForClass(Hoitruong);

