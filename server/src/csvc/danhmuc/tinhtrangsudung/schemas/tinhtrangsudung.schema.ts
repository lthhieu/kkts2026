
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type TinhtrangsudungDocument = HydratedDocument<Tinhtrangsudung>;

@Schema({ timestamps: true })
export class Tinhtrangsudung {
    @Prop()
    name: string;

}

export const TinhtrangsudungSchema = SchemaFactory.createForClass(Tinhtrangsudung);
