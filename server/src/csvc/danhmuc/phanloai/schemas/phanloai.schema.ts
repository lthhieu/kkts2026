import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type PhanloaiDocument = HydratedDocument<Phanloai>;

@Schema({ timestamps: true })
export class Phanloai {
    @Prop()
    name: string;

}

export const PhanloaiSchema = SchemaFactory.createForClass(Phanloai);
