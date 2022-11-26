import { LoggedInUser } from "./../auth/types/current-user.type";
import { NotificationsService } from "./notifications.service";
import { Query, Resolver } from "@nestjs/graphql";
import { CurrentUser } from "src/auth/decorators/user.decorator";
import { UserGuard } from "src/auth/guards/user.guard";
import { UseGuards } from "@nestjs/common";

@Resolver()
@UseGuards(UserGuard)
export class NotificationsResolver {
    constructor(private notificationsService: NotificationsService) {}

    @Query()
    notifications(@CurrentUser() user: LoggedInUser) {
        return this.notificationsService.getNotifications(user.userId);
    }
}
