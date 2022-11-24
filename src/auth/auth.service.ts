import { SesManagerService } from "./../ses-manager/ses-manager.service";
import {
    SignUpInput,
    SignInInput,
    EmailVerificationInput,
    LoggedInResponse,
    ResetPasswordInput,
} from "./../graphql";
import { User, UserDocument } from "./../schemas/user.schema";
import {
    Injectable,
    InternalServerErrorException,
    BadRequestException,
    ConflictException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import { EmailType } from "src/ses-manager/types/email.type";
import { ResetPasswordVerifiedToken, VerifiedToken } from "./types/token.type";

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
        private sesManagerService: SesManagerService,
    ) {}

    async signup(signupInput: SignUpInput) {
        const { email, name, password } = signupInput;
        const user = await this.userModel
            .findOne({ email })
            .select("id email password isVerified bannedQuestions");
        if (user && user.isVerified) {
            throw new ConflictException("Account has already used");
        } else if (user && user.bannedQuestions >= 5) {
            throw new ConflictException("Account was banned");
        } else if (user) {
            const token = jwt.sign(
                { id: user._id, email },
                process.env.JWT_VERIFICATION_KEY,
                {
                    expiresIn: "10m",
                },
            );
            const emailParams = this.sesManagerService.getEmailParams(
                EmailType.VERIFICATION,
                email,
                token,
            );
            await this.sesManagerService.sendEmail(emailParams);
            return `Verification email has sent to ${email}, please check.`;
        } else {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            const newUser = new this.userModel({
                email,
                name,
                password: hashedPassword,
                bannedQuestions: 0,
                lastQuestionAt: null,
                attention: []
            });
            const token = jwt.sign(
                { id: newUser._id, email },
                process.env.JWT_VERIFICATION_KEY,
                {
                    expiresIn: "10m",
                },
            );
            const emailParams = this.sesManagerService.getEmailParams(
                EmailType.VERIFICATION,
                email,
                token,
            );
            await this.sesManagerService.sendEmail(emailParams);
            await newUser.save();
            return `Verification email has sent to ${email}, please check.`;
        }
    }

    async verifyEmail(
        emailVerificationInput: EmailVerificationInput,
    ): Promise<string> {
        const { token } = emailVerificationInput;
        return new Promise(async (resolve, reject) => {
            try {
                const { id } = <VerifiedToken>(
                    jwt.verify(token, process.env.JWT_VERIFICATION_KEY)
                );
                const user = await this.userModel
                    .findById({ _id: id })
                    .select("isVerified");
                if (!user) {
                    throw new ConflictException("Account not found");
                } else if (user.isVerified) {
                    throw new ConflictException("Account has already verified");
                } else {
                    user.isVerified = true;
                    await user.save();
                    resolve("Verified");
                }
            } catch (e) {
                reject(e);
            }
        });
    }

    async signin(signInInput: SignInInput) {
        const { email, password } = signInInput;
        const user = await this.userModel
            .findOne({ email, isVerified: true })
            .select(
                "_id name password role profileImage.url unreadNotification",
            );
        if (!user) {
            throw new BadRequestException("Account not found");
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new BadRequestException("Password is incorrect");
        }
        const token = jwt.sign(
            {
                sub: user._id,
                role: user.role,
                loggedInAt: new Date(),
            },
            process.env.JWT_AUTHENTICATION_KEY!,
            {
                expiresIn: "5d",
            },
        );
        const loggedInResponse: LoggedInResponse = {
            id: user._id.toString(),
            name: user.name,
            profileImage: user.profileImage,
            unreadNotification: user.unreadNotification,
            token,
        };
        return loggedInResponse;
    }

    async sendOtoToSpecificEmail(email: string) {
        const count = await this.userModel
            .findOne({ email, isVerified: true })
            .count();
        if (count === 0) {
            throw new ConflictException("Email not found");
        }
        const token = jwt.sign(
            { email },
            process.env.JWT_RESET_PASSWORD_TOKEN_KEY!,
            {
                expiresIn: "10m",
            },
        );
        const emailParams = this.sesManagerService.getEmailParams(
            EmailType.RESET_PASSWORD,
            email,
            token,
        );
        await this.sesManagerService.sendEmail(emailParams);
        return `Reset password email has been sent to ${email}, please check.`;
    }

    resetPassword(resetPasswordInput: ResetPasswordInput): Promise<string> {
        const { token, password } = resetPasswordInput;
        return new Promise(async (resolve, reject) => {
            try {
                const { email } = <ResetPasswordVerifiedToken>(
                    jwt.verify(token, process.env.JWT_RESET_PASSWORD_TOKEN_KEY!)
                );
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(password, salt);

                const user = await this.userModel
                    .findOne({ email, isVerified: true })
                    .select("name bannedQuestions");
                if (!user) {
                    throw new ConflictException("Account not found");
                } else if (user.bannedQuestions >= 5) {
                    throw new ConflictException("Account was banned");
                }
                await this.userModel.updateOne(
                    { email },
                    { password: hashedPassword },
                );
                resolve(`Password has reset for ${user.name}`);
            } catch (e) {
                reject(e);
            }
        });
    }

    async getNewRefreshToken() {}
}
