import { User, UserDocument, Role } from "./../schemas/user.schema";
import {
    Notification,
    NotificationDocument,
    NotificationType,
} from "./../schemas/notification.schema";
import { ForbiddenException } from "@nestjs/common/exceptions";
import { Topic, TopicDocument } from "./../schemas/topic.schema";
import { S3ManagerService } from "./../s3-manager/s3-manager.service";
import { ConflictException } from "@nestjs/common";
import { CreateBlogInput, UpdateBlogInput } from "./../graphql";
import { Model } from "mongoose";
import { Blog, BlogDocument } from "./../schemas/blog.schema";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import slugify from "slugify";

@Injectable()
export class BlogsService {
    constructor(
        @InjectModel(Blog.name) private blogModel: Model<BlogDocument>,
        @InjectModel(Topic.name) private topicModel: Model<TopicDocument>,
        @InjectModel(User.name) private UserModel: Model<UserDocument>,
        @InjectModel(Notification.name)
        private notificationModel: Model<NotificationDocument>,
        private s3ManagerService: S3ManagerService,
    ) {}

    private async checkIsBlogOwner(doctorId: string, blogId: string) {
        const blog = await this.blogModel
            .findById(blogId)
            .select("_id user image.key topic");
        if (!blog) {
            throw new ConflictException("Blog not found");
        }
        if (blog.user.toString() !== doctorId) {
            throw new ForbiddenException("Access Denied");
        }
        return blog;
    }

    private async increaseUnreadNotification(userIds: string[]) {
        await this.UserModel.updateMany(
            { _id: { $in: userIds } },
            { $inc: { unreadNotification: 1 } },
        );
    }

    private async alertInterestedPatient(topicId: string, blogId: string) {
        const users = await this.UserModel.find({
            attention: topicId,
            role: Role.PATIENT,
        }).select("_id");
        const notifications = [];
        for (const user of users) {
            const newNotification = {
                type: NotificationType.BLOG,
                blog: blogId,
                userId: user._id,
                createdAt: new Date(),
            };
            notifications.push(newNotification);
        }
        await this.notificationModel.insertMany(notifications);
        this.increaseUnreadNotification(
            users.map((user) => user._id.toString()),
        );
    }

    async createBlog(doctorId: string, createBlogInput: CreateBlogInput) {
        const { title, content, image, topicId } = createBlogInput;
        const slug = slugify(title, "_");
        const isTitleExists = await this.blogModel
            .findOne({ title: slug })
            .select("title");
        if (isTitleExists) {
            throw new ConflictException("Blog title has already exists");
        }
        const isTopicExists = await this.topicModel.findById(topicId);
        if (!isTopicExists) {
            throw new ConflictException("Topic not found");
        }
        const uploadedImage = await this.s3ManagerService.uploadToS3(
            "blog-images",
            image,
        );
        const newBlog = new this.blogModel({
            title,
            slug,
            content,
            image: {
                url: uploadedImage.Location,
                key: uploadedImage.Key,
            },
            topic: topicId,
            user: doctorId,
        });
        await newBlog.save();
        this.alertInterestedPatient(topicId, newBlog._id.toString());
        return slug;
    }

    async updateBlog(
        doctorId: string,
        blogId: string,
        updateBlogInput: UpdateBlogInput,
    ) {
        const blog = await this.checkIsBlogOwner(doctorId, blogId);
        const { title, content, image, topicId } = updateBlogInput;
        if (blog.topic !== topicId) {
            const topic = await this.topicModel.findById(topicId).select("_id");
            if (!topic) {
                throw new ConflictException("Topic not found");
            }
        }
        const slug = slugify(title, "_");
        if (image) {
            const uploadedImage = await this.s3ManagerService.uploadToS3(
                "blog-images",
                image,
            );
            await this.blogModel.updateOne(
                { _id: blogId },
                {
                    title,
                    slug,
                    content,
                    image: {
                        key: uploadedImage.Key,
                        url: uploadedImage.Location,
                    },
                    topic: topicId,
                },
            );
            this.s3ManagerService.removeObjectFromS3(blog.image.key);
            return uploadedImage.Location;
        } else {
            await this.blogModel.updateOne(
                { _id: blogId },
                { title, slug, content, topic: topicId },
            );
        }
    }

    async deleteBlog(doctorId: string, blogId: string) {
        const blog = await this.checkIsBlogOwner(doctorId, blogId);
        await this.blogModel.deleteOne({ _id: blogId });
        await this.s3ManagerService.removeObjectFromS3(blog.image.key);
    }

    getAllBlogs() {
        return this.blogModel
            .find({})
            .populate("topic", "_id topic")
            .populate("user", "_id name profileImage")
            .sort({ createdAt: -1 });
    }

    getTopicBlogs(topicId: string) {
        return this.blogModel
            .find({ topic: topicId })
            .populate("topic", "_id topic")
            .populate("user", "_id name profileImage")
            .sort({ createdAt: -1 });
    }

    searchBlog(keyword: string) {
        return this.blogModel
            .find({ title: new RegExp(keyword, "i") })
            .populate("topic", "_id topic")
            .populate("user", "_id name profileImage");
    }
}
