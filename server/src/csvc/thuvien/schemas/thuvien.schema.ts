import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ThuvienDocument = HydratedDocument<Thuvien>;

@Schema({ timestamps: true })
export class Thuvien {
    @Prop()
    ma: string;

    @Prop()
    name: string;

    @Prop({ default: 0 })
    nam_sd: number;

    @Prop({ default: 0 })
    dt: number;


}

export const ThuvienSchema = SchemaFactory.createForClass(Thuvien);

