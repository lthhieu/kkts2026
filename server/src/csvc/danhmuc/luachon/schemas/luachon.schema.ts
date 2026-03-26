import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type LuachonDocument = HydratedDocument<Luachon>;

@Schema({ timestamps: true })
export class Luachon {
    @Prop()
    name: string;

}

export const LuachonSchema = SchemaFactory.createForClass(Luachon);


