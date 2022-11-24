import { S3ManagerService } from "./../s3-manager/s3-manager.service";
import { CreateDoctorInput } from "./../graphql";
import { Model } from "mongoose";
import { User, UserDocument, Role } from "./../schemas/user.schema";
import { Injectable, ConflictException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import * as bcrypt from "bcrypt";

@Injectable()
export class AdminService {
    constructor(
        private s3ManagerService: S3ManagerService,
        @InjectModel(User.name) private userModel: Model<UserDocument>,
    ) {}

    async createDoctor(createDoctorInput: CreateDoctorInput) {
        const { name, email, password, image } = createDoctorInput;
        const user = await this.userModel
            .findOne({ email })
            .select("isVerified role");
        if (user && !user.isVerified) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            if (image) {
                const uploadedFile = await this.s3ManagerService.uploadToS3(
                    "profile-images",
                    image,
                );
                return this.userModel.findOneAndUpdate(
                    { email },
                    {
                        name,
                        role: Role.DOCTOR,
                        password: hashedPassword,
                        profileImage: {
                            key: uploadedFile.Key,
                            url: uploadedFile.Location,
                        },
                        isVerified: true,
                        personalInformation: "",
                    },
                    {
                        new: true,
                    },
                );
            } else {
                return this.userModel.findOneAndUpdate(
                    { email },
                    {
                        name,
                        role: Role.DOCTOR,
                        password: hashedPassword,
                        isVerified: true,
                        personalInformation: "",
                    },
                    {
                        new: true,
                    },
                );
            }
        } else if (user) {
            throw new ConflictException("Email has already used");
        } else {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            let newDoctor;
            if (image) {
                const uploadedFile = await this.s3ManagerService.uploadToS3(
                    "profile-images",
                    image,
                );
                newDoctor = new this.userModel({
                    email,
                    name,
                    role: Role.DOCTOR,
                    password: hashedPassword,
                    profileImage: {
                        key: uploadedFile.Key,
                        url: uploadedFile.Location,
                    },
                    isVerified: true,
                    personalInformation: "",
                    attention: []
                });
            } else {
                newDoctor = new this.userModel({
                    email,
                    name,
                    role: Role.DOCTOR,
                    password: hashedPassword,
                    isVerified: true,
                    personalInformation: "",
                    attention: []
                });
            }
            await newDoctor.save();
            return newDoctor;
        }
    }
}
