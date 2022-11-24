import { AdminGuard } from './../auth/guards/admin.guard';
import { CreateDoctorInput } from './dto/create-doctor.dto';
import { AdminService } from './admin.service';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import {UseGuards} from "@nestjs/common";

@Resolver()
export class AdminResolver {
    constructor(private adminService: AdminService) {}

    @Mutation()
    @UseGuards(AdminGuard)
    createDoctor(@Args("createDoctorInput") createDoctorInput: CreateDoctorInput) {
        return this.adminService.createDoctor(createDoctorInput);
    }
}
