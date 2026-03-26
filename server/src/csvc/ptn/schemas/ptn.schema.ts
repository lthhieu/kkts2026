import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Ctk } from 'src/csvc/ctk/schemas/ctk.schema';
import { Linhvucdaotao } from 'src/csvc/danhmuc/linhvucdaotao/schemas/linhvucdaotao.schema';
import { Loaiptn } from 'src/csvc/danhmuc/loaiptn/schemas/loaiptn.schema';

export type PtnDocument = HydratedDocument<Ptn>;

@Schema({ timestamps: true })
export class Ptn {

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Ctk.name })
    ma_ct_csvc: Ctk | null;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Loaiptn.name })
    loai_ptn: Loaiptn | null;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Linhvucdaotao.name })
    phuc_vu_nganh: Linhvucdaotao | null;

    @Prop()
    muc_do_dap_ung_nhu_cau_nckh: string;

    @Prop()
    nam_sd: number;

}

export const PtnSchema = SchemaFactory.createForClass(Ptn);

