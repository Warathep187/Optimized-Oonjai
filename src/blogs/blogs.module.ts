import { User, UserSchema } from "./../schemas/user.schema";
import {
    NotificationSchema,
    Notification,
} from "./../schemas/notification.schema";
import { NotificationsService } from "./../notifications/notifications.service";
import { Topic, TopicSchema } from "./../schemas/topic.schema";
import { S3ManagerService } from "./../s3-manager/s3-manager.service";
import { Blog, BlogSchema } from "./../schemas/blog.schema";
import { MongooseModule } from "@nestjs/mongoose";
import { DoctorJwtStrategy } from "./../auth/strategies/doctor.strategy";
import { Module } from "@nestjs/common";
import { BlogsResolver } from "./blogs.resolver";
import { BlogsService } from "./blogs.service";

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Blog.name, schema: BlogSchema },
            { name: Topic.name, schema: TopicSchema },
            { name: Notification.name, schema: NotificationSchema },
            { name: User.name, schema: UserSchema },
        ]),
    ],
    providers: [
        BlogsResolver,
        BlogsService,
        DoctorJwtStrategy,
        S3ManagerService,
        NotificationsService,
    ],
})
export class BlogsModule {}
