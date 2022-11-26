import { User } from "./user.schema";
import { Schema, Prop, SchemaFactory, raw } from "@nestjs/mongoose";
import { HydratedDocument, Schema as MongoSchema } from "mongoose";

export type BlogDocument = HydratedDocument<Blog>;

interface BlogImage {
    key: string;
    url: string;
}

@Schema({ versionKey: false, timestamps: true })
export class Blog {
    @Prop({ required: true })
    title: string;

    @Prop({ required: true, index: true, unique: true })
    slug: string;

    @Prop()
    content: string;

    @Prop(
        raw({
            key: {
                type: String,
                required: true,
            },
            url: {
                type: String,
                required: true,
            },
        }),
    )
    image: BlogImage;

    @Prop({ default: 0 })
    views: number;

    @Prop({ required: true, type: MongoSchema.Types.ObjectId, ref: "Topic" })
    topic: string;

    @Prop({ required: true, type: MongoSchema.Types.ObjectId, ref: "User" })
    user: string;
}

export const BlogSchema = SchemaFactory.createForClass(Blog);
