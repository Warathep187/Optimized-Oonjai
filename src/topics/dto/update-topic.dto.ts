import { InputType } from "@nestjs/graphql";
import { IsHexadecimal, IsNotEmpty, IsString } from "class-validator";

@InputType()
export class UpdateTopicInput {
    @IsHexadecimal()
    topicId: string;

    @IsString()
    @IsNotEmpty()
    topic: string;
}