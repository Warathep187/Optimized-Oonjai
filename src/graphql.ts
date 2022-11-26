
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export enum NotificationType {
    BLOG = "BLOG",
    QUESTION = "QUESTION",
    ANSWER = "ANSWER",
    REPLY = "REPLY",
    QUESTION_BANNED = "QUESTION_BANNED"
}

export class CreateDoctorInput {
    name: string;
    email: string;
    password: string;
    image: string;
}

export class SignUpInput {
    email: string;
    name: string;
    password: string;
}

export class EmailVerificationInput {
    token: string;
}

export class SignInInput {
    email: string;
    password: string;
}

export class ResetPasswordInput {
    token: string;
    password: string;
}

export class CreateBlogInput {
    title: string;
    content: string;
    image: string;
    topicId: string;
}

export class UpdateBlogInput {
    title: string;
    content: string;
    image?: Nullable<string>;
    topicId: string;
}

export class PatientUpdateNameInput {
    name: string;
}

export class DoctorUpdateProfileInput {
    name: string;
    personalInformation: string;
}

export class UpdateProfileImageInput {
    image: string;
}

export class UpdatePasswordInput {
    password: string;
}

export class CreateTopicInput {
    topic: string;
}

export class UpdateTopicInput {
    topicId: string;
    topic: string;
}

export class Doctor {
    _id: string;
    name: string;
    profileImage: Image;
    personalInformation: string;
    createdAt: string;
}

export abstract class IMutation {
    abstract createDoctor(createDoctorInput?: Nullable<CreateDoctorInput>): Doctor | Promise<Doctor>;

    abstract signup(signupInput: SignUpInput): string | Promise<string>;

    abstract verify(emailVerificationInput?: Nullable<EmailVerificationInput>): Nullable<string> | Promise<Nullable<string>>;

    abstract signin(signinInput: SignInInput): LoggedInResponse | Promise<LoggedInResponse>;

    abstract getResetPasswordOtp(email?: Nullable<string>): string | Promise<string>;

    abstract resetPassword(resetPasswordInput: ResetPasswordInput): string | Promise<string>;

    abstract createBlog(createBlogInput: CreateBlogInput): string | Promise<string>;

    abstract updateBlog(blogId: string, updateBlogInput: UpdateBlogInput): Nullable<string> | Promise<Nullable<string>>;

    abstract deleteBlog(blogId: string): Nullable<string> | Promise<Nullable<string>>;

    abstract patientUpdateName(patientUpdateNameInput: PatientUpdateNameInput): string | Promise<string>;

    abstract doctorUpdateProfile(doctorUpdateProfileInput: DoctorUpdateProfileInput): Nullable<string> | Promise<Nullable<string>>;

    abstract updateProfileImage(updateProfileImageInput: UpdateProfileImageInput): Image | Promise<Image>;

    abstract updatePassword(updatePasswordInput?: Nullable<UpdatePasswordInput>): Nullable<string> | Promise<Nullable<string>>;

    abstract insertAttention(insertAttentionInput: Nullable<string>[]): Topic[] | Promise<Topic[]>;

    abstract removeAttention(removeAttentionInput: string): Nullable<string> | Promise<Nullable<string>>;

    abstract createTopic(createTopicInput?: Nullable<CreateTopicInput>): Topic | Promise<Topic>;

    abstract updateTopic(updateTopicInput?: Nullable<UpdateTopicInput>): Nullable<string> | Promise<Nullable<string>>;

    abstract deleteTopic(topicId: string): Nullable<string> | Promise<Nullable<string>>;
}

export class Image {
    url: string;
}

export class Tokens {
    token: string;
    refreshToken: string;
}

export class LoggedInResponse {
    id: string;
    name: string;
    profileImage: Image;
    unreadNotification: number;
    token: string;
}

export abstract class IQuery {
    abstract refreshToken(): Tokens | Promise<Tokens>;

    abstract blogs(): Nullable<Blog>[] | Promise<Nullable<Blog>[]>;

    abstract topicBlogs(topicId: string): Nullable<Blog>[] | Promise<Nullable<Blog>[]>;

    abstract searchBlogs(keyword: string): Nullable<Blog>[] | Promise<Nullable<Blog>[]>;

    abstract notifications(): Notification | Promise<Notification>;

    abstract doctorPrivateProfile(): DoctorPrivateProfile | Promise<DoctorPrivateProfile>;

    abstract doctorPublicProfile(id: string): DoctorPublicProfile | Promise<DoctorPublicProfile>;

    abstract topics(): Nullable<Topic>[] | Promise<Nullable<Topic>[]>;
}

export class Blog {
    _id: string;
    title: string;
    content: string;
    image?: Nullable<Image>;
    views: number;
    topic: Topic;
    user: PreviewProfile;
    createdAt: DateTime;
}

export class Question {
    _id: string;
}

export class Notification {
    _id: string;
    type: NotificationType;
    blog: Blog;
    question: Question;
    user: string;
    createdAt: DateTime;
}

export class PreviewProfile {
    _id?: Nullable<string>;
    name: string;
    profileImage: Image;
}

export class DoctorPrivateProfile {
    _id: string;
    email: string;
    name: string;
    profileImage: Image;
    personalInformation: string;
    topics: Nullable<Topic>[];
}

export class DoctorPublicProfile {
    _id: string;
    name: string;
    profileImage: Image;
    personalInformation: string;
    topics: Nullable<Topic>[];
}

export class Topic {
    _id: string;
    topic: string;
}

export type DateTime = any;
type Nullable<T> = T | null;
