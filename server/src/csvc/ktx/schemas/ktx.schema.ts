import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Hinhthucsohuu } from 'src/csvc/danhmuc/hinhthucsohuu/schemas/hinhthucsohuu.schema';
import { Tinhtrangcsvc } from 'src/csvc/danhmuc/tinhtrangcsvc/schemas/tinhtrangcsvc.schema';

export type KtxDocument = HydratedDocument<Ktx>;

@Schema({ timestamps: true })
export class Ktx {
    @Prop()
    ma_ktx: string;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Hinhthucsohuu.name })
    htsh: Hinhthucsohuu | null;

    @Prop()
    tong_so_cho_o: number;

    @Prop()
    tong_dt: number;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Tinhtrangcsvc.name })
    tinhtrangcsvc: Tinhtrangcsvc | null;

    @Prop()
    tong_so_phong_o_sv: number;

    @Prop()
    nam_sd: number;

}

export const KtxSchema = SchemaFactory.createForClass(Ktx);


