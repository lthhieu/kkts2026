import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Ctk } from 'src/csvc/ctk/schemas/ctk.schema';

export type TbiptnDocument = HydratedDocument<Tbiptn>;

@Schema({ timestamps: true })
export class Tbiptn {
    @Prop()
    ma_tb: string;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Ctk.name })
    ma_ct_csvc: Ctk | null;

    @Prop()
    ten_tb: string;

    @Prop()
    nam_sx: number;

    @Prop()
    xuatxu: string;

    @Prop()
    hang_sx: string;

    @Prop()
    sl_tb_cungloai: number;

    @Prop()
    nam_sd: number;

}

export const TbiptnSchema = SchemaFactory.createForClass(Tbiptn);


