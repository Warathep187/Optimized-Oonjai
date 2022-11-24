import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { Injectable } from "@nestjs/common";
import { LoggedInVerifiedToken } from "../types/token.type";
import { Role } from "src/schemas/user.schema";
import { ForbiddenException } from "@nestjs/common/exceptions";

@Injectable()
export class DoctorJwtStrategy extends PassportStrategy(
    Strategy,
    "jwt-doctor-authentication",
) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_AUTHENTICATION_KEY!,
        });
    }

    async validate(payload: LoggedInVerifiedToken) {
        const { role } = payload;
        if (role !== Role.DOCTOR) {
            throw new ForbiddenException("Access denied");
        }

        return {
            userId: payload.sub,
            role: payload.role,
            loggedInAt: payload.loggedInAt,
        };
    }
}
