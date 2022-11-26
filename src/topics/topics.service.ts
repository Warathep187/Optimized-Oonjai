import { CreateTopicInput, UpdateTopicInput } from "./../graphql";
import { Model } from "mongoose";
import { Topic, TopicDocument } from "./../schemas/topic.schema";
import { Injectable, ConflictException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";

@Injectable()
export class TopicsService {
    constructor(
        @InjectModel(Topic.name) private topicModel: Model<TopicDocument>,
    ) {}

    async createTopic(createTopicInput: CreateTopicInput) {
        const topicExists = await this.topicModel.findOne({
            topic: createTopicInput.topic,
        });
        if (topicExists) {
            throw new ConflictException("Topic is duplicate");
        }
        const newTopic = new this.topicModel({ topic: createTopicInput.topic });
        await newTopic.save();
        return newTopic;
    }

    async updateTopic(updateTopicInput: UpdateTopicInput) {
        const topicExists = await this.topicModel.findOne({
            topic: updateTopicInput.topic,
        });
        if (
            topicExists &&
            topicExists._id.toString() !== updateTopicInput.topicId
        ) {
            throw new ConflictException("Topic is duplicate");
        }
        await this.topicModel.updateOne(
            { _id: updateTopicInput.topicId },
            { topic: updateTopicInput.topic },
        );
    }

    async deleteTopic(topicId: string) {
        await this.topicModel.deleteOne({ _id: topicId });
    }

    getTopics() {
        return this.topicModel.find().sort({ topic: 1 });
    }
}
