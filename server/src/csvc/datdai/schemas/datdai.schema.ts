import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type DatdaiDocument = HydratedDocument<Datdai>;

@Schema({ timestamps: true })
export class Datdai {
    @Prop()
    ma_giay_cnqsh: string;

    @Prop()
    thua: number;

    @Prop()
    dt: number;

    @Prop({ default: null })
    diachi: string;

    @Prop({ default: null })
    ghichu: string;

}

export const DatdaiSchema = SchemaFactory.createForClass(Datdai);