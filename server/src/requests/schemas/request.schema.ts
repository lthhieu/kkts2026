import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { DevicesV2 } from 'src/devices-v2/schemas/devices-v2.schema';
import { Device } from 'src/devices/schemas/device.schema';
import { Unit } from 'src/units/schemas/unit.schema';
import { User } from 'src/users/schemas/user.schema';

export type RequestDocument = HydratedDocument<Request>;

@Schema({ timestamps: true })
export class Request {
    @Prop()
    name: string;

    @Prop()
    type: string;

    @Prop({ default: 'approved' })
    status: string;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
    createdBy: User | null;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: DevicesV2.name })
    device: DevicesV2 | null;

    @Prop()
    description: string;

    @Prop()
    image?: string;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Unit.name })
    unit: Unit | null;

    @Prop()
    reason?: string;

    @Prop({
        type: [{
            content: String,          // Nội dung bình luận
            createdBy: { type: mongoose.Schema.Types.ObjectId, ref: User.name }, // Người viết
            createdAt: Date,          // Thời gian
        }], default: []
    })
    comments: any[];

}

export const RequestSchema = SchemaFactory.createForClass(Request);