import { S3 } from "aws-sdk";
import { Injectable } from "@nestjs/common";
import { InjectAwsService } from "nest-aws-sdk";
import { v4 as uuid } from "uuid";

@Injectable()
export class S3ManagerService {
    constructor(@InjectAwsService(S3) private s3: S3) {}

    private getUploadObjectParams(
        directory: string,
        fullBase64: string,
    ): S3.PutObjectRequest {
        const colonIndex = fullBase64.indexOf(":");
        const semicolonIndex = fullBase64.indexOf(";");
        const mimetype = fullBase64.substring(colonIndex + 1, semicolonIndex);
        const extension = mimetype.split("/")[1];
        const imageBuffer = Buffer.from(
            fullBase64.replace(/^data:image\/\w+;base64,/, ""),
            "base64",
        );
        return {
            Bucket: process.env.AWS_S3_BUCKET,
            Key: `${directory}/${uuid()}.${extension}`,
            Body: imageBuffer,
            ACL: "public-read",
            ContentType: mimetype,
        };
    }

    private getDeleteOjectParams(key: string): S3.DeleteObjectRequest {
        return {
            Bucket: process.env.AWS_S3_BUCKET,
            Key: key,
        };
    }

    async uploadToS3(
        directory: string,
        fullBase64: string,
    ): Promise<S3.ManagedUpload.SendData> {
        const params = this.getUploadObjectParams(directory, fullBase64);
        return this.s3.upload(params).promise();
    }

    removeObjectFromS3(key: string): Promise<void> {
        return new Promise(async (resolve, reject) => {
            try {
                const params = this.getDeleteOjectParams(key);
                await this.s3.deleteObject(params).promise();
                resolve();
            } catch (e) {
                reject(e);
            }
        });
    }
}
