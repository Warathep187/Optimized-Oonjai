import { InputType } from "@nestjs/graphql";
import { IsHexadecimal, IsNotEmpty, IsString } from "class-validator";

@InputType()
export class UpdateBlogInput {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    content: string;

    @IsString()
    image: string;

    @IsHexadecimal()
    topicId: string;
}
