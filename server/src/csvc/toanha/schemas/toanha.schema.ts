import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Hinhthucsohuu } from 'src/csvc/danhmuc/hinhthucsohuu/schemas/hinhthucsohuu.schema';
import { Tinhtrangsudung } from 'src/csvc/danhmuc/tinhtrangsudung/schemas/tinhtrangsudung.schema';

export type ToanhaDocument = HydratedDocument<Toanha>;

@Schema({ timestamps: true })
export class Toanha {
    @Prop()
    ma_toanha: string;

    @Prop()
    ten_toanha: string;

    @Prop()
    dtxd: number;

    @Prop()
    tong_dt_sxd: number;

    @Prop()
    so_tang: number;

    @Prop()
    nam_sd: number;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Hinhthucsohuu.name })
    htsh: Hinhthucsohuu | null;

    @Prop({ default: null })
    diachi: string;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Tinhtrangsudung.name })
    tinh_trang_sd: Tinhtrangsudung | null;

    @Prop({ default: null })
    ngay_chuyen_tt: string;

}

export const ToanhaSchema = SchemaFactory.createForClass(Toanha);

