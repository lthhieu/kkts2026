import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Hinhthucsohuu } from 'src/csvc/danhmuc/hinhthucsohuu/schemas/hinhthucsohuu.schema';
import { Tinhthanhpho } from 'src/csvc/danhmuc/tinhthanhpho/schemas/tinhthanhpho.schema';
import { Tinhtrangsudung } from 'src/csvc/danhmuc/tinhtrangsudung/schemas/tinhtrangsudung.schema';
import { Xaphuong } from 'src/csvc/danhmuc/xaphuong/schemas/xaphuong.schema';

export type DatdaiDocument = HydratedDocument<Datdai>;

@Schema({ timestamps: true })
export class Datdai {
    @Prop()
    ma_giay_cnqsh: string;

    @Prop()
    dt: string;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Hinhthucsohuu.name })
    htsh: Hinhthucsohuu | null;

    @Prop({ default: null })
    cqsh: string;

    @Prop({ default: null })
    minh_chung_qshd: string;

    @Prop({ default: null })
    muc_dich_shd: string;

    @Prop({ default: null })
    name_bd_sdd: number;

    @Prop({ default: null })
    tg_sdd: number;

    @Prop({ default: null })
    dtd_da_sd: number;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Tinhtrangsudung.name })
    tinh_trang_sd: Tinhtrangsudung | null;

    @Prop({ default: null })
    ngay_chuyen_tt: string;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Tinhthanhpho.name })
    tinhthanhpho: Tinhthanhpho | null;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Xaphuong.name })
    xaphuong: Xaphuong | null;

    @Prop({ default: null })
    diachi: string;

}

export const DatdaiSchema = SchemaFactory.createForClass(Datdai);