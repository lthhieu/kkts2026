import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Hinhthucsohuu } from 'src/csvc/danhmuc/hinhthucsohuu/schemas/hinhthucsohuu.schema';
import { Tinhtrangcsvc } from 'src/csvc/danhmuc/tinhtrangcsvc/schemas/tinhtrangcsvc.schema';
import { Tinhtrangsudung } from 'src/csvc/danhmuc/tinhtrangsudung/schemas/tinhtrangsudung.schema';

export type ThuvienDocument = HydratedDocument<Thuvien>;

@Schema({ timestamps: true })
export class Thuvien {
    @Prop()
    ma_thuvien: string;

    @Prop()
    name: string;

    @Prop({ default: 0 })
    nam_sd: number;

    @Prop({ default: 0 })
    dt: number;

    @Prop({ default: 0 })
    dt_phongdoc: number;

    @Prop({ default: 0 })
    so_phong_doc: number;

    @Prop({ default: 0 })
    soluong_maytinh: number;

    @Prop({ default: 0 })
    soluong_cho_ngoi_doc_sach: number;

    @Prop({ default: 0 })
    soluong_sach: number;

    @Prop({ default: 0 })
    soluong_tapchi: number;

    @Prop({ default: 0 })
    soluong_sach_dien_tu: number;

    @Prop({ default: 0 })
    soluong_tapchi_dien_tu: number;

    @Prop({ default: 0 })
    soluong_thu_vien_lien_ket_trong_nuoc: number;

    @Prop({ default: 0 })
    soluong_thu_vien_dien_tu_lien_ket_nuoc_ngoai: number;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Tinhtrangcsvc.name, default: null })
    tinhtrangcsvc: Tinhtrangcsvc | null;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Hinhthucsohuu.name, default: null })
    htsh: Hinhthucsohuu | null;

    @Prop({ default: 0 })
    soluong_dau_sach: number;

    @Prop({ default: 0 })
    soluong_dau_tap_chi: number;

    @Prop({ default: 0 })
    soluong_dau_sach_dien_tu: number;

    @Prop({ default: 0 })
    soluong_dau_tap_chi_dien_tu: number;

    @Prop({ default: null })
    diachi: string;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Tinhtrangsudung.name, default: null })
    tinh_trang_sd: Tinhtrangsudung | null;

    @Prop({ default: null })
    ngay_chuyen_tt: string;

    @Prop({ default: 0 })
    so_dau_sach_dien_tu_co_truy_cap_truc_tuyen: number;

    @Prop({ default: 0 })
    so_dau_sach_co_ban_in: number;

    @Prop({ default: 0 })
    so_dau_sach_in_co_the_muon_truc_tiep: number;

}

export const ThuvienSchema = SchemaFactory.createForClass(Thuvien);

