import { InputType } from "@nestjs/graphql";
import { IsEmail, MinLength, IsString } from "class-validator";

@InputType()
export class SignInInput {
    @IsEmail()
    email: string;

    @IsString()
    @MinLength(6)
    password: string;
}
