
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

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

    abstract patientUpdateName(patientUpdateNameInput: PatientUpdateNameInput): string | Promise<string>;

    abstract doctorUpdateProfile(doctorUpdateProfileInput: DoctorUpdateProfileInput): Nullable<string> | Promise<Nullable<string>>;

    abstract updateProfileImage(updateProfileImageInput: UpdateProfileImageInput): Image | Promise<Image>;

    abstract updatePassword(updatePasswordInput?: Nullable<UpdatePasswordInput>): Nullable<string> | Promise<Nullable<string>>;

    abstract insertAttention(insertAttentionInput: Nullable<string>[]): Topic[] | Promise<Topic[]>;

    abstract removeAttention(removeAttentionInput: string): string | Promise<string>;
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

    abstract doctorPrivateProfile(): DoctorPrivateProfile | Promise<DoctorPrivateProfile>;

    abstract doctorPublicProfile(id: string): DoctorPublicProfile | Promise<DoctorPublicProfile>;
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
    topic: string;
}

export type DateTime = any;
type Nullable<T> = T | null;
