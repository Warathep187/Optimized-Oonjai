import { UpdatePasswordInput } from "./dto/update-password.dto";
import { UpdateProfileImageInput } from "./../graphql";
import { UserGuard } from "./../auth/guards/user.guard";
import { DoctorUpdateProfileInput } from "./dto/doctor-update-profile.dto";
import { PatientGuard } from "./../auth/guards/patient.guard";
import { PatientUpdateNameInput } from "./dto/patient-update-name.dto";
import { LoggedInUser } from "./../auth/types/current-user.type";
import { DoctorGuard } from "./../auth/guards/doctor.guard";
import { ProfileService } from "./profile.service";
import { Resolver, Query, Args, Mutation } from "@nestjs/graphql";
import { UseGuards, NotFoundException } from "@nestjs/common";
import { CurrentUser } from "src/auth/decorators/user.decorator";
import { Types } from "mongoose";

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
    ) {
        return this.profileService.updateProfile(
            user.userId,
            doctorUpdateProfileInput,
        );
    }

    @Mutation()
    @UseGuards(UserGuard)
    updateProfileImage(
        @CurrentUser() user: LoggedInUser,
        @Args("updateProfileImageInput")
        updateProfileImageInput: UpdateProfileImageInput,
    ) {
        return this.profileService.updateProfileImage(
            user.userId,
            updateProfileImageInput.image,
        );
    }

    @Mutation()
    @UseGuards(UserGuard)
    updatePassword(
        @CurrentUser() user: LoggedInUser,
        @Args("updatePasswordInput") updatePasswordInput: UpdatePasswordInput,
    ) {
        return this.profileService.updatePassword(
            user.userId,
            updatePasswordInput,
        );
    }

    @Mutation()
    @UseGuards(UserGuard)
    insertAttention(
        @CurrentUser() user: LoggedInUser,
        @Args("insertAttentionInput") insertAttentionInput: string[],
    ) {
        const uniqueSelectedTopics = [...new Set(insertAttentionInput)];
        return this.profileService.insertTopicToAttentionList(
            user.userId,
            uniqueSelectedTopics,
        );
    }

    @Mutation()
    @UseGuards(UserGuard)
    removeAttention(
        @CurrentUser() user: LoggedInUser,
        @Args("removeAttentionInput") topicId: string,
    ) {
        return this.profileService.removeTopicFromAttentionList(
            user.userId,
            topicId,
        );
    }
}
