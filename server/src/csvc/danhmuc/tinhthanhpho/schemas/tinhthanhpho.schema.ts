import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type TinhthanhphoDocument = HydratedDocument<Tinhthanhpho>;

@Schema({ timestamps: true })
export class Tinhthanhpho {
    @Prop()
    name: string;

}

export const TinhthanhphoSchema = SchemaFactory.createForClass(Tinhthanhpho);
