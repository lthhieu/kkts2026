import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type TinhtrangcsvcDocument = HydratedDocument<Tinhtrangcsvc>;

@Schema({ timestamps: true })
export class Tinhtrangcsvc {
    @Prop()
    name: string;

}

export const TinhtrangcsvcSchema = SchemaFactory.createForClass(Tinhtrangcsvc);
