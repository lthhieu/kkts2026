import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Tinhthanhpho } from 'src/csvc/danhmuc/tinhthanhpho/schemas/tinhthanhpho.schema';

export type XaphuongDocument = HydratedDocument<Xaphuong>;

@Schema({ timestamps: true })
export class Xaphuong {
    @Prop()
    name: string;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Tinhthanhpho.name })
    tinhthanhpho: Tinhthanhpho | null;

}

export const XaphuongSchema = SchemaFactory.createForClass(Xaphuong);
