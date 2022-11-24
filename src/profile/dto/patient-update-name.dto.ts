import { InputType } from "@nestjs/graphql";
import { IsNotEmpty, IsString } from "class-validator";

@InputType()
export class PatientUpdateNameInput {
    @IsString()
    @IsNotEmpty()
    name: string;
}