import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Hinhthucsohuu } from 'src/csvc/danhmuc/hinhthucsohuu/schemas/hinhthucsohuu.schema';
import { Loaicongtrinhcsvc } from 'src/csvc/danhmuc/loaicongtrinhcsvc/schemas/loaicongtrinhcsvc.schema';
import { Luachon } from 'src/csvc/danhmuc/luachon/schemas/luachon.schema';
import { Mucdichsudungcsvc } from 'src/csvc/danhmuc/mucdichsudungcsvc/schemas/mucdichsudungcsvc.schema';
import { Tinhtrangcsvc } from 'src/csvc/danhmuc/tinhtrangcsvc/schemas/tinhtrangcsvc.schema';

export type CtkDocument = HydratedDocument<Ctk>;

@Schema({ timestamps: true })
export class Ctk {
    @Prop()
    ma_ct: string;

    @Prop()
    ten_ct: string;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Loaicongtrinhcsvc.name })
    loaicongtrinhcsvc: Loaicongtrinhcsvc | null;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Mucdichsudungcsvc.name })
    mucdichsudungcsvc: Mucdichsudungcsvc | null;

    @Prop()
    doi_tuong_sd: string;

    @Prop()
    dt_sxd: number;

    @Prop()
    von_bd: number;

    @Prop()
    von_dt: number;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Tinhtrangcsvc.name })
    tinhtrangcsvc: Tinhtrangcsvc | null;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Hinhthucsohuu.name })
    htsh: Hinhthucsohuu | null;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Luachon.name })
    ct_csvc_trongnha: Luachon | null;

    @Prop()
    so_phong_o_cong_vu_cho_cb_gianday: number;

    @Prop()
    so_cho_o_cho_cb_gianday: number;

    @Prop()
    nam_sd: number;

}

export const CtkSchema = SchemaFactory.createForClass(Ctk);

