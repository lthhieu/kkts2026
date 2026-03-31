import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Hinhthucsohuu } from 'src/csvc/danhmuc/hinhthucsohuu/schemas/hinhthucsohuu.schema';
import { Loaicongtrinhcsvc } from 'src/csvc/danhmuc/loaicongtrinhcsvc/schemas/loaicongtrinhcsvc.schema';
import { Luachon } from 'src/csvc/danhmuc/luachon/schemas/luachon.schema';
import { Mucdichsudungcsvc } from 'src/csvc/danhmuc/mucdichsudungcsvc/schemas/mucdichsudungcsvc.schema';
import { Tinhtrangcsvc } from 'src/csvc/danhmuc/tinhtrangcsvc/schemas/tinhtrangcsvc.schema';
import { Tinhtrangsudung } from 'src/csvc/danhmuc/tinhtrangsudung/schemas/tinhtrangsudung.schema';

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

    @Prop({ default: 0 })
    von_bd: number;

    @Prop({ default: 0 })
    von_dt: number;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Tinhtrangcsvc.name, default: null })
    tinhtrangcsvc: Tinhtrangcsvc | null;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Hinhthucsohuu.name, default: null })
    htsh: Hinhthucsohuu | null;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Luachon.name })
    ct_csvc_trongnha: Luachon | null;

    @Prop({ default: 0 })
    so_phong_o_cong_vu_cho_cb_giangday: number;

    @Prop({ default: 0 })
    so_cho_o_cho_cb_giangday: number;

    @Prop()
    nam_sd: number;

    @Prop({ default: null })
    diachi: string;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Tinhtrangsudung.name })
    tinh_trang_sd: Tinhtrangsudung | null;

    @Prop({ default: null })
    ngay_chuyen_tt: string;

}

export const CtkSchema = SchemaFactory.createForClass(Ctk);

