
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ThuchanhDocument = HydratedDocument<Thuchanh>;

@Schema({ timestamps: true })
export class Thuchanh {
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

export const ThuchanhSchema = SchemaFactory.createForClass(Thuchanh);

