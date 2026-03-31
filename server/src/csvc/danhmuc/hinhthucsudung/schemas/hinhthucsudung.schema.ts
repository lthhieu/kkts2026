import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type HinhthucsudungDocument = HydratedDocument<Hinhthucsudung>;

@Schema({ timestamps: true })
export class Hinhthucsudung {
    @Prop()
    name: string;

}

export const HinhthucsudungSchema = SchemaFactory.createForClass(Hinhthucsudung);
