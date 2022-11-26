import { ApolloDriverConfig, ApolloDriver } from "@nestjs/apollo";
import { Module } from "@nestjs/common";
import { GraphQLModule } from "@nestjs/graphql";
import { join } from "path";
import { ApolloServerPluginLandingPageLocalDefault } from "apollo-server-core";
import { AuthModule } from "./auth/auth.module";
import { MongooseModule } from "@nestjs/mongoose";
import { AwsSdkModule } from "nest-aws-sdk";
import { S3, SES } from "aws-sdk";
import { SesManagerModule } from "./ses-manager/ses-manager.module";
import { ConfigModule } from "@nestjs/config";
import { ProfileModule } from './profile/profile.module';
import { AdminModule } from './admin/admin.module';
import { S3ManagerModule } from './s3-manager/s3-manager.module';
import { TopicsModule } from './topics/topics.module';
import { NotificationsModule } from './notifications/notifications.module';
import { BlogsModule } from './blogs/blogs.module';
import * as Joi from "joi";

@Module({
    imports: [
        GraphQLModule.forRoot<ApolloDriverConfig>({
            driver: ApolloDriver,
            playground: false,
            plugins: [ApolloServerPluginLandingPageLocalDefault()],
            typePaths: ["./**/*.graphql"],
            definitions: {
                path: join(process.cwd(), "src/graphql.ts"),
                outputAs: "class",
            },
        }),
        MongooseModule.forRoot("mongodb://localhost/OptimizedOonjai"),
        AwsSdkModule.forRoot({
            defaultServiceOptions: {
                region: "ap-southeast-1",
            },
            services: [SES, S3],
        }),
        ConfigModule.forRoot({
            isGlobal: true,
            validationSchema: Joi.object({
                JWT_VERIFICATION_KEY: Joi.string().required(),
                SOURCE_EMAIL: Joi.string().required(),
                CLIENT_URL: Joi.string().regex(
                    /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
                ),
                JWT_AUTHENTICATION_KEY: Joi.string().required(),
                JWT_REFRESH_TOKEN_KEY: Joi.string().required(),
                JWT_RESET_PASSWORD_TOKEN_KEY: Joi.string().required(),
                AWS_S3_BUCKET: Joi.string().required()
            }),
        }),
        AuthModule,
        SesManagerModule,
        ProfileModule,
        AdminModule,
        S3ManagerModule,
        TopicsModule,
        NotificationsModule,
        BlogsModule,
    ],
})
export class AppModule {}
