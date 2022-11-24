import { InputType } from "@nestjs/graphql";
import { IsJWT, IsString, MinLength } from "class-validator";

@InputType()
export class ResetPasswordInput {
    @IsJWT()
    token: string;

    @IsString()
    @MinLength(6)
    password: string;
}