import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type LoaideanDocument = HydratedDocument<Loaidean>;

@Schema({ timestamps: true })
export class Loaidean {
    @Prop()
    name: string;

}

export const LoaideanSchema = SchemaFactory.createForClass(Loaidean);

