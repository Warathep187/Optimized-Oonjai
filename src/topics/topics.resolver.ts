import { UpdateTopicInput } from './dto/update-topic.dto';
import { CreateTopicInput } from './dto/create-topic.dto';
import { UseGuards } from '@nestjs/common';
import { DoctorGuard } from './../auth/guards/doctor.guard';
import { TopicsService } from './topics.service';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

@Resolver()
export class TopicsResolver {
    constructor(private topicsService: TopicsService) {}

    @Mutation()
    @UseGuards(DoctorGuard)
    createTopic(@Args("createTopicInput") createTopicInput: CreateTopicInput) {
        return this.topicsService.createTopic(createTopicInput);
    }

    @Mutation()
    @UseGuards(DoctorGuard)
    updateTopic(@Args("updateTopicInput") updateTopicInput: UpdateTopicInput) {
        return this.topicsService.updateTopic(updateTopicInput);
    }

    @Mutation()
    @UseGuards(DoctorGuard)
    deleteTopic(@Args("topicId") topicId: string) {
        return this.topicsService.deleteTopic(topicId);
    }

    @Query()
    topics() {
        return this.topicsService.getTopics();
    }
}
