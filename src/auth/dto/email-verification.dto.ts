import { InputType } from "@nestjs/graphql";
import { IsJWT } from "class-validator";

@InputType()
export class EmailVerificationInput {
    @IsJWT()
    token: string;
}