import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type MucdichsudungdatDocument = HydratedDocument<Mucdichsudungdat>;

@Schema({ timestamps: true })
export class Mucdichsudungdat {
    @Prop()
    name: string;

}

export const MucdichsudungdatSchema = SchemaFactory.createForClass(Mucdichsudungdat);
