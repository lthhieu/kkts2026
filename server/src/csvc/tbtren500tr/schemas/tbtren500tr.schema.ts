import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Unit } from 'src/units/schemas/unit.schema';

export type Tbtren500trDocument = HydratedDocument<Tbtren500tr>;

@Schema({ timestamps: true })
export class Tbtren500tr {

    @Prop({ default: '' })
    code: string;

    @Prop({ required: true })
    name: string;

    @Prop({ default: '' })
    description: string;

    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        ref: Unit.name,
    })
    unit: Unit | null;

    @Prop()
    yearUse: number;

    @Prop({ default: 1 })
    quantity: number;

    @Prop({ default: 0 })
    originalPrice: number;

    @Prop({ default: '' })
    note: string;

    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        ref: Tbtren500tr.name,
        default: null,
    })
    parentId: Tbtren500tr | null;

}
export const Tbtren500trSchema = SchemaFactory.createForClass(Tbtren500tr);

