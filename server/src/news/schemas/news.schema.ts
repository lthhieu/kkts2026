import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from 'src/users/schemas/user.schema';

export type NewsDocument = HydratedDocument<News>;

@Schema({ timestamps: true })
export class News {
    @Prop()
    title: string;
    @Prop()
    slug: string;
    @Prop()
    content: string;
    @Prop()
    thumbnail: string;
    @Prop()
    category: string;
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
    author: User | null;
    // @Prop()
    // postedAt: string;
}

export const NewsSchema = SchemaFactory.createForClass(News);