import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type TopicDocument = HydratedDocument<Topic>;

@Schema({versionKey: false})
export class Topic {
    @Prop({ required: true, index: true, unique: true })
    topic: string;
}

export const TopicSchema = SchemaFactory.createForClass(Topic);
