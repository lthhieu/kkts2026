import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Hinhthucsohuu } from 'src/csvc/danhmuc/hinhthucsohuu/schemas/hinhthucsohuu.schema';
import { Tinhtrangcsvc } from 'src/csvc/danhmuc/tinhtrangcsvc/schemas/tinhtrangcsvc.schema';

export type ThuvienDocument = HydratedDocument<Thuvien>;

@Schema({ timestamps: true })
export class Thuvien {
    @Prop()
    ma_thuvien: string;

    @Prop()
    name: string;

    @Prop()
    nam_sd: number;

    @Prop()
    dt: number;

    @Prop()
    dt_phongdoc: number;

    @Prop()
    so_phong_doc: number;

    @Prop()
    soluong_maytinh: number;

    @Prop()
    soluong_cho_ngoi_doc_sach: number;

    @Prop()
    soluong_sach: number;

    @Prop()
    soluong_tapchi: number;

    @Prop()
    soluong_sach_dien_tu: number;

    @Prop()
    soluong_tapchi_dien_tu: number;

    @Prop()
    soluong_thu_vien_lien_ket_trong_nuoc: number;

    @Prop()
    soluong_thu_vien_dien_tu_lien_ket_nuoc_ngoai: number;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Tinhtrangcsvc.name })
    tinhtrangcsvc: Tinhtrangcsvc | null;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Hinhthucsohuu.name })
    htsh: Hinhthucsohuu | null;

    @Prop()
    soluong_dau_sach: number;

    @Prop()
    soluong_dau_tap_chi: number;

    @Prop()
    soluong_dau_sach_dien_tu: number;

    @Prop()
    soluong_dau_tap_chi_dien_tu: number;

}

export const ThuvienSchema = SchemaFactory.createForClass(Thuvien);

