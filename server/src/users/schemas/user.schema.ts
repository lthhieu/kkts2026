import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Unit } from 'src/units/schemas/unit.schema';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
    @Prop()
    name: string;

    @Prop()
    email: string;

    @Prop()
    password: string;

    @Prop({ type: String, default: null })
    refreshToken: string | null;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Unit.name, default: null })
    unit: Unit | null;

    @Prop()
    role: string;

}

export const UserSchema = SchemaFactory.createForClass(User);