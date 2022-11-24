import { Schema, Prop, SchemaFactory, raw } from "@nestjs/mongoose";
import { HydratedDocument, Schema as MongoSchema } from "mongoose";

export type UserDocument = HydratedDocument<User>;

export enum Role {
    PATIENT = "PATIENT",
    DOCTOR = "DOCTOR",
    ADMIN = "ADMIN",
}

interface ProfileImage {
    key: string;
    url: string;
}

@Schema({ timestamps: true, versionKey: false })
export class User {
    @Prop({ required: true, index: true, unique: true })
    email: string;

    @Prop({ required: true })
    name: string;

    @Prop({ require: true })
    password: string;

    @Prop({
        type: String,
        enum: ["PATIENT", "DOCTOR", "ADMIN"],
        default: Role.PATIENT,
    })
    role: Role;

    @Prop(
        raw({
            key: {
                type: String,
                default: null,
            },
            url: {
                type: String,
                default: "/images/unknown-profile-image.jpg",
            },
        }),
    )
    profileImage: ProfileImage;

    @Prop({ default: false })
    isVerified: boolean;

    @Prop()
    personalInformation?: string;

    @Prop({default: 0})
    unreadNotification: number;

    @Prop()
    bannedQuestions?: number;

    @Prop()
    lastQuestionAt?: Date;

    @Prop({ type: [MongoSchema.Types.ObjectId], ref: "Topic" })
    attention: string[];
}

export const UserSchema = SchemaFactory.createForClass(User);
