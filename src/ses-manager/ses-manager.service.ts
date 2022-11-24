import { EmailType } from "./types/email.type";
import { SES } from "aws-sdk";
import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { InjectAwsService } from "nest-aws-sdk";

@Injectable()
export class SesManagerService {
    constructor(@InjectAwsService(SES) private ses: SES) {}

    getEmailParams(
        type: EmailType,
        destEmail: string,
        token: string,
    ): SES.SendEmailRequest {
        if (type === EmailType.VERIFICATION) {
            const fullUrl = `${process.env.CLIENT_URL}/verify/${token}`;
            return {
                Destination: {
                    CcAddresses: [],
                    ToAddresses: [destEmail],
                },
                Message: {
                    Body: {
                        Html: {
                            Charset: "UTF-8",
                            Data: `<a href="${fullUrl}">${fullUrl}</a>`,
                        },
                        Text: {
                            Charset: "UTF-8",
                            Data: "TEXT_FORMAT_BODY",
                        },
                    },
                    Subject: {
                        Charset: "UTF-8",
                        Data: "Email Verification",
                    },
                },
                Source: process.env.SOURCE_EMAIL,
                ReplyToAddresses: [process.env.SOURCE_EMAIL],
            };
        } else if (type === EmailType.RESET_PASSWORD) {
            const fullUrl = `${process.env.CLIENT_URL}/password/reset/${token}`;
            return {
                Destination: {
                    CcAddresses: [],
                    ToAddresses: [destEmail],
                },
                Message: {
                    Body: {
                        Html: {
                            Charset: "UTF-8",
                            Data: `<a href="${fullUrl}">${fullUrl}</a>`,
                        },
                        Text: {
                            Charset: "UTF-8",
                            Data: "TEXT_FORMAT_BODY",
                        },
                    },
                    Subject: {
                        Charset: "UTF-8",
                        Data: "Reset Password Procedure",
                    },
                },
                Source: process.env.SOURCE_EMAIL,
                ReplyToAddresses: [process.env.SOURCE_EMAIL],
            };
        }
    }

    sendEmail(params: SES.SendEmailRequest): Promise<SES.SendEmailResponse> {
        return new Promise((resolve, reject) => {
            this.ses.sendEmail(params, (err, result) => {
                if (err) {
                    throw new InternalServerErrorException(
                        "Could not sent email",
                    );
                } else {
                    resolve(result);
                }
            });
        });
    }
}
