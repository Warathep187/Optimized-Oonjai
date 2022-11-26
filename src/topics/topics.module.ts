import { DoctorJwtStrategy } from "./../auth/strategies/doctor.strategy";
import { Topic, TopicSchema } from "./../schemas/topic.schema";
import { MongooseModule } from "@nestjs/mongoose";
import { Module } from "@nestjs/common";
import { TopicsResolver } from "./topics.resolver";
import { TopicsService } from "./topics.service";

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Topic.name, schema: TopicSchema }]),
    ],
    providers: [TopicsResolver, TopicsService, DoctorJwtStrategy],
})
export class TopicsModule {}
