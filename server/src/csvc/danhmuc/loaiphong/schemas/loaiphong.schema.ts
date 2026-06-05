import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type LoaiphongDocument = HydratedDocument<Loaiphong>;

@Schema({ timestamps: true })
export class Loaiphong {
    @Prop()
    name: string;

}

export const LoaiphongSchema = SchemaFactory.createForClass(Loaiphong);
