import { InputType } from "@nestjs/graphql";
import { IsString, MinLength } from "class-validator";

@InputType()
export class UpdatePasswordInput {
    @IsString()
    @MinLength(6)
    password: string;
}