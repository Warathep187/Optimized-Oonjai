import { S3ManagerService } from "src/s3-manager/s3-manager.service";
import { User, UserSchema } from "./../schemas/user.schema";
import { Topic, TopicSchema } from "./../schemas/topic.schema";
import { MongooseModule } from "@nestjs/mongoose";
import { PatientJwtStrategy } from "./../auth/strategies/patient.strategy";
import { DoctorJwtStrategy } from "./../auth/strategies/doctor.strategy";
import { Module } from "@nestjs/common";
import { ProfileResolver } from "./profile.resolver";
import { ProfileService } from "./profile.service";

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: User.name, schema: UserSchema },
            { name: Topic.name, schema: TopicSchema },
        ]),
    ],
    providers: [
        ProfileResolver,
        ProfileService,
        DoctorJwtStrategy,
        PatientJwtStrategy,
        S3ManagerService,
    ],
})
export class ProfileModule {}
