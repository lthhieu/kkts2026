import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Hinhthucsudung } from 'src/csvc/danhmuc/hinhthucsudung/schemas/hinhthucsudung.schema';
import { Mucdichsudungdat } from 'src/csvc/danhmuc/mucdichsudungdat/schemas/mucdichsudungdat.schema';
import { Tinhthanhpho } from 'src/csvc/danhmuc/tinhthanhpho/schemas/tinhthanhpho.schema';
import { Tinhtrangsudung } from 'src/csvc/danhmuc/tinhtrangsudung/schemas/tinhtrangsudung.schema';
import { Xaphuong } from 'src/csvc/danhmuc/xaphuong/schemas/xaphuong.schema';

export type DatdaiDocument = HydratedDocument<Datdai>;

@Schema({ timestamps: true })
export class Datdai {
    @Prop()
    ma_giay_cnqsh: string;

    @Prop()
    dt: number;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Hinhthucsudung.name })
    htsd: Hinhthucsudung | null;

    @Prop({ default: null })
    cqsh: string;

    @Prop({ default: null })
    minh_chung_qshd: string;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Mucdichsudungdat.name, default: null })
    muc_dich_shd: Mucdichsudungdat | null;

    @Prop({ default: 0 })
    nam_bd_sdd: number;

    @Prop({ default: 0 })
    tg_sdd: number;

    @Prop({ default: 0 })
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