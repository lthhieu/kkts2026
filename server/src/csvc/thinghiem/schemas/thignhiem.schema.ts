
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ThinghiemDocument = HydratedDocument<Thinghiem>;

@Schema({ timestamps: true })
export class Thinghiem {
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

export const ThinghiemSchema = SchemaFactory.createForClass(Thinghiem);

