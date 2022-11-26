import { Schema, Prop, SchemaFactory, raw } from "@nestjs/mongoose";
import { HydratedDocument, Schema as MongoSchema } from "mongoose";

export type NotificationDocument = HydratedDocument<Notification>;

export enum NotificationType {
    BLOG = "BLOG",
    QUESTION = "QUESTION",
    ANSWER = "ANSWER",
    REPLY = "REPLY",
    QUESTION_BANNED = "QUESTION_BANNED",
}

@Schema({ versionKey: false, timestamps: false })
export class Notification {
    @Prop({
        enum: ["BLOG", "QUESTION", "ANSWER", "REPLY", "QUESTION_BANNED"],
        required: true,
    })
    type: NotificationType;

    @Prop({ type: MongoSchema.Types.ObjectId, ref: "Blog" })
    blog: string;

    @Prop({ type: MongoSchema.Types.ObjectId, ref: "Question" })
    question: string;

    @Prop({ type: String, required: true })
    userId: string;

    @Prop({ type: Date, required: true })
    createdAt: Date;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
