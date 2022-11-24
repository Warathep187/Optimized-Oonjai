import { DoctorUpdateProfileInput } from "./dto/doctor-update-profile.dto";
import { PatientGuard } from "./../auth/guards/patient.guard";
import { PatientUpdateNameInput } from "./dto/patient-update-name.dto";
import { LoggedInUser } from "./../auth/types/current-user.type";
import { DoctorGuard } from "./../auth/guards/doctor.guard";
import { ProfileService } from "./profile.service";
import { Resolver, Query, Args, Mutation } from "@nestjs/graphql";
import { UseGuards, NotFoundException } from "@nestjs/common";
import { CurrentUser } from "src/auth/decorators/user.decorator";
import {Types} from "mongoose";

@Resolver()
export class ProfileResolver {
    constructor(private profileService: ProfileService) {}

    @Query()
    @UseGuards(DoctorGuard)
    doctorPrivateProfile(@CurrentUser() user: LoggedInUser) {
        return this.profileService.getDoctorPrivateProfile(user.userId);
    }

    @Query()
    doctorPublicProfile(@Args("id") id: string) {
        if (!Types.ObjectId.isValid(id)) {
            throw new NotFoundException("Doctor not found");
        }
        return this.profileService.getDoctorPublicProfile(id);
    }

    @Mutation()
    @UseGuards(PatientGuard)
    patientUpdateName(
        @CurrentUser() user: LoggedInUser,
        @Args("patientUpdateNameInput")
        patientUpdateNameInput: PatientUpdateNameInput,
    ) {
        return this.profileService.updateName(
            user.userId,
            patientUpdateNameInput,
        );
    }

    @Mutation()
    @UseGuards(DoctorGuard)
    doctorUpdateProfile(
        @CurrentUser() user: LoggedInUser,
        @Args("doctorUpdateProfileInput")
        doctorUpdateProfileInput: DoctorUpdateProfileInput,
    ) {}

    @Mutation()
    updateProfileImage() {}

    @Mutation()
    updatePassword() {}

    @Mutation()
    insertAttention() {}

    @Mutation()
    removeAttention() {}
}
