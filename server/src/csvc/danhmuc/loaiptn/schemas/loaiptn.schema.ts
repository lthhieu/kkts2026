import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type LoaiptnDocument = HydratedDocument<Loaiptn>;

@Schema({ timestamps: true })
export class Loaiptn {
    @Prop()
    name: string;

}

export const LoaiptnSchema = SchemaFactory.createForClass(Loaiptn);
