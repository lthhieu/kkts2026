import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Ctk } from 'src/csvc/ctk/schemas/ctk.schema';
import { Country } from 'src/csvc/danhmuc/countries/schemas/country.schema';
import { Tinhtrangsudung } from 'src/csvc/danhmuc/tinhtrangsudung/schemas/tinhtrangsudung.schema';

export type TbiptnDocument = HydratedDocument<Tbiptn>;

@Schema({ timestamps: true })
export class Tbiptn {
    @Prop()
    ma_tb: string;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Ctk.name })
    ma_ct_csvc: Ctk | null;

    @Prop()
    ten_tb: string;

    @Prop({ default: 0 })
    nam_sx: number;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Country.name, default: null })
    xuatxu: Country | null;

    @Prop({ default: null })
    hang_sx: string;

    @Prop({ default: 0 })
    sl_tb_cungloai: number;

    @Prop()
    nam_sd: number;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Tinhtrangsudung.name })
    tinh_trang_sd: Tinhtrangsudung | null;

    @Prop({ default: null })
    ngay_chuyen_tt: string;

}

export const TbiptnSchema = SchemaFactory.createForClass(Tbiptn);


