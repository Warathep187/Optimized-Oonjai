import {InputType, Field} from "@nestjs/graphql";
import { IsEmail, IsString } from "class-validator";
import { IsNotEmpty, MinLength } from "class-validator";

@InputType()
export class SignupInput {
    @IsEmail()
    @Field()
    email: string;
    
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    @MinLength(6)
    @Field()
    password: string;
}