import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type LinhvucdaotaoDocument = HydratedDocument<Linhvucdaotao>;

@Schema({ timestamps: true })
export class Linhvucdaotao {
    @Prop()
    name: string;

}

export const LinhvucdaotaoSchema = SchemaFactory.createForClass(Linhvucdaotao);
