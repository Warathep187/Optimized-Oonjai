import { Role } from "./../../schemas/user.schema";
export interface VerifiedToken {
    id: string;
    email: string;
}

export interface ResetPasswordVerifiedToken {
    email: string;
}

export interface LoggedInVerifiedToken {
    sub: string;
    role: Role;
    loggedInAt: Date;
}
