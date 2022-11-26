import {
    NotificationDocument,
    NotificationType,
    Notification
} from "./../schemas/notification.schema";
import { Model } from "mongoose";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";

@Injectable()
export class NotificationsService {
    constructor(
        @InjectModel(Notification.name)
        private notificationModel: Model<NotificationDocument>,
    ) {}

    getNotifications(userId: string) {
        return this.notificationModel
            .find({ user: userId })
            .populate("blog", "_id title")
            .populate("question", "_id title");
    }
}
