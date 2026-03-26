import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type HinhthucsohuuDocument = HydratedDocument<Hinhthucsohuu>;

@Schema({ timestamps: true })
export class Hinhthucsohuu {
    @Prop()
    name: string;

}

export const HinhthucsohuuSchema = SchemaFactory.createForClass(Hinhthucsohuu);