import { UserJwtStrategy } from "./../auth/strategies/user.strategy";
import { NotificationSchema, Notification } from "./../schemas/notification.schema";
import { MongooseModule } from "@nestjs/mongoose";
import { Module } from "@nestjs/common";
import { NotificationsResolver } from "./notifications.resolver";
import { NotificationsService } from "./notifications.service";

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Notification.name, schema: NotificationSchema },
        ]),
    ],
    providers: [NotificationsResolver, NotificationsService, UserJwtStrategy],
    exports: [NotificationsService]
})
export class NotificationsModule {}
