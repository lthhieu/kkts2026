import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type KtxDocument = HydratedDocument<Ktx>;

@Schema({ timestamps: true })
export class Ktx {
    @Prop()
    ma: string;

    @Prop()
    name: string;

    @Prop()
    dt: number;

    @Prop()
    sc: number;

    @Prop()
    nam_sd: number;

}

export const KtxSchema = SchemaFactory.createForClass(Ktx);


