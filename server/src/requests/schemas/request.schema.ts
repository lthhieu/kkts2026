import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Device } from 'src/devices/schemas/device.schema';
import { Unit } from 'src/units/schemas/unit.schema';

export type RequestDocument = HydratedDocument<Request>;

@Schema({ timestamps: true })
export class Request {
    @Prop()
    name: string;

    @Prop()
    type: string;

    @Prop({ default: 'approved' })
    status: string;

    @Prop()
    createdBy: string;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Device.name })
    device: Device | null;

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
            createdBy: String, // Người viết
            createdAt: Date,          // Thời gian
        }], default: []
    })
    comments: any[];

}

export const RequestSchema = SchemaFactory.createForClass(Request);