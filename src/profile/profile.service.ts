import { Topic, TopicDocument } from "./../schemas/topic.schema";
import { S3ManagerService } from "src/s3-manager/s3-manager.service";
import {
    PatientUpdateNameInput,
    DoctorUpdateProfileInput,
    UpdatePasswordInput,
} from "./../graphql";
import { Role } from "src/schemas/user.schema";
import { Model } from "mongoose";
import { User, UserDocument } from "./../schemas/user.schema";
import {
    Injectable,
    NotFoundException,
    ConflictException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import * as bcrypt from "bcrypt";

@Injectable()
export class ProfileService {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
        @InjectModel(Topic.name) private topicModel: Model<TopicDocument>,
        private s3ManagerService: S3ManagerService,
    ) {}

    private async checkIsTopicExists(
        topics: string[],
        insertedTopics: TopicDocument[],
    ): Promise<TopicDocument[]> {
        if (topics.length === 0) {
            return insertedTopics;
        }
        const topic = await this.topicModel.findById(topics[topics.length - 1]);
        if (!topic) {
            throw new ConflictException("Topic not found");
        }
        topics.pop();
        insertedTopics.push(topic);
        return insertedTopics;
    }

    getDoctorPrivateProfile(doctorId: string) {
        return this.userModel
            .findById(doctorId)
            .select("_id email name profileImage.url personalInformation");
    }

    async getDoctorPublicProfile(doctorId: string) {
        const doctor = await this.userModel
            .findOne({ _id: doctorId, role: Role.DOCTOR })
            .select("_id name profileImage.url personalInformation attention")
            .populate("attention", "topic");
        if (!doctor) {
            throw new NotFoundException("Doctor not found");
        }
        return doctor;
    }

    async updateName(
        userId: string,
        patientUpdateNameInput: PatientUpdateNameInput,
    ) {
        await this.userModel.updateOne({ _id: userId }, patientUpdateNameInput);
        return patientUpdateNameInput.name;
    }

    async updateProfile(
        doctorId: string,
        doctorUpdateProfileInput: DoctorUpdateProfileInput,
    ) {
        await this.userModel.updateOne(
            { _id: doctorId },
            doctorUpdateProfileInput,
        );
    }

    async updateProfileImage(userId: string, fullBase64: string) {
        const user = await this.userModel
            .findById(userId)
            .select("profileImage");
        const key = JSON.parse(JSON.stringify(user.profileImage.key));
        const uploadedImage = await this.s3ManagerService.uploadToS3(
            "profile-images",
            fullBase64,
        );
        const uploaded = {
            key: uploadedImage.Key,
            url: uploadedImage.Location,
        };
        user.profileImage = uploaded;
        await user.save();
        if (key) {
            this.s3ManagerService.removeObjectFromS3(key);
        }
        return uploaded;
    }

    async updatePassword(
        userId: string,
        updatePasswordInput: UpdatePasswordInput,
    ) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(
            updatePasswordInput.password,
            salt,
        );
        await this.userModel.updateMany(
            { _id: userId },
            { password: hashedPassword },
        );
    }

    async insertTopicToAttentionList(userId: string, topics: string[]) {
        const user = await this.userModel.findById(userId).select("attention");
        for (const topicId of topics) {
            if (user.attention.includes(topicId)) {
                topics = topics.filter((id) => id !== topicId);
            }
        }
        const insertedTopics = await this.checkIsTopicExists(
            JSON.parse(JSON.stringify(topics)),
            [],
        );
        await this.userModel.updateOne(
            { _id: userId },
            { $push: { attention: { $each: topics } } },
        );
        return insertedTopics;
    }

    async removeTopicFromAttentionList(userId: string, topicId: string) {
        await this.userModel.updateOne(
            { _id: userId },
            { $pull: { attention: topicId } },
        );
    }
}
