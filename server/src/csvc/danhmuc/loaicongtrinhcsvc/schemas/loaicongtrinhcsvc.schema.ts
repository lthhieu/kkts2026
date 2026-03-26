import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type LoaicongtrinhcsvcDocument = HydratedDocument<Loaicongtrinhcsvc>;

@Schema({ timestamps: true })
export class Loaicongtrinhcsvc {
    @Prop()
    name: string;

}

export const LoaicongtrinhcsvcSchema = SchemaFactory.createForClass(Loaicongtrinhcsvc);

