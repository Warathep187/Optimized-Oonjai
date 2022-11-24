import { AdminJwtStrategy } from './../auth/strategies/admin.strategy';
import { User, UserSchema } from "./../schemas/user.schema";
import { MongooseModule } from "@nestjs/mongoose";
import { Module } from "@nestjs/common";
import { AdminResolver } from "./admin.resolver";
import { AdminService } from "./admin.service";
import { S3ManagerService } from 'src/s3-manager/s3-manager.service';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    ],
    providers: [AdminResolver, AdminService, AdminJwtStrategy, S3ManagerService],
})
export class AdminModule {}
