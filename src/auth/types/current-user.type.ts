import { Role } from "src/schemas/user.schema";

export interface LoggedInUser {
    userId: string;
    role: Role;
    loggedInAt: Date;
}
