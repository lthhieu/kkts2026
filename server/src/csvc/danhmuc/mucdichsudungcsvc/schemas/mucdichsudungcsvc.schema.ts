import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type MucdichsudungcsvcDocument = HydratedDocument<Mucdichsudungcsvc>;

@Schema({ timestamps: true })
export class Mucdichsudungcsvc {
    @Prop()
    name: string;

}

export const MucdichsudungcsvcSchema = SchemaFactory.createForClass(Mucdichsudungcsvc);
