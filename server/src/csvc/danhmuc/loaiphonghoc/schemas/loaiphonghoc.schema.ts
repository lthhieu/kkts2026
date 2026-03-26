import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type LoaiphonghocDocument = HydratedDocument<Loaiphonghoc>;

@Schema({ timestamps: true })
export class Loaiphonghoc {
    @Prop()
    name: string;

}

export const LoaiphonghocSchema = SchemaFactory.createForClass(Loaiphonghoc);
