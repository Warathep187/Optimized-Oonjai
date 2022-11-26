import { InputType } from "@nestjs/graphql";
import { IsNotEmpty, IsString } from "class-validator";

@InputType()
export class CreateTopicInput {
    @IsString()
    @IsNotEmpty()
    topic: string;
}