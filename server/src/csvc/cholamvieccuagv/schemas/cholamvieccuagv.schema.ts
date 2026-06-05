
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CholamvieccuagvDocument = HydratedDocument<Cholamvieccuagv>;

@Schema({ timestamps: true })
export class Cholamvieccuagv {
    @Prop()
    ma: string;

    @Prop()
    name: string;

    @Prop()
    dt: number;

}

export const CholamvieccuagvSchema = SchemaFactory.createForClass(Cholamvieccuagv);

