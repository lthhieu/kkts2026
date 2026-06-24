import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type NccDocument = HydratedDocument<Ncc>;

@Schema({ timestamps: true })
export class Ncc {
    @Prop()
    name: string;

}

export const NccSchema = SchemaFactory.createForClass(Ncc);