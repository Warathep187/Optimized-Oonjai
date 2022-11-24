import { InputType } from "@nestjs/graphql";
import { IsNotEmpty, IsString } from "class-validator";

@InputType()
export class DoctorUpdateProfileInput {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    personalInformation: string;
}