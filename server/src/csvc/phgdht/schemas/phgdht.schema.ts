
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Hinhthucsohuu } from 'src/csvc/danhmuc/hinhthucsohuu/schemas/hinhthucsohuu.schema';
import { Loaidean } from 'src/csvc/danhmuc/loaidean/schemas/loaidean.schema';
import { Loaiphonghoc } from 'src/csvc/danhmuc/loaiphonghoc/schemas/loaiphonghoc.schema';
import { Phanloai } from 'src/csvc/danhmuc/phanloai/schemas/phanloai.schema';
import { Tinhtrangcsvc } from 'src/csvc/danhmuc/tinhtrangcsvc/schemas/tinhtrangcsvc.schema';
import { Tinhtrangsudung } from 'src/csvc/danhmuc/tinhtrangsudung/schemas/tinhtrangsudung.schema';

export type PhgdhtDocument = HydratedDocument<Phgdht>;

@Schema({ timestamps: true })
export class Phgdht {
    @Prop()
    ma_phgdht: string;

    @Prop()
    name: string;

    @Prop()
    dt: number;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Hinhthucsohuu.name })
    htsh: Hinhthucsohuu | null;

    @Prop()
    qui_mo_cho_ngoi: number;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Tinhtrangcsvc.name })
    tinhtrangcsvc: Tinhtrangcsvc | null;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Phanloai.name })
    phanloai: Phanloai | null;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Loaiphonghoc.name })
    loaiphonghoc: Loaiphonghoc | null;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Loaidean.name })
    loaidean: Loaidean | null;

    @Prop({ default: 0 })
    nam_sd: number;

    @Prop({ default: null })
    diachi: string;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Tinhtrangsudung.name })
    tinh_trang_sd: Tinhtrangsudung | null;

    @Prop({ default: null })
    ngay_chuyen_tt: string;

}

export const PhgdhtSchema = SchemaFactory.createForClass(Phgdht);

