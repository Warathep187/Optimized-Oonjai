import { PatientGuard } from "./guards/patient.guard";
import { ResetPasswordInput } from "./dto/reset-password.dto";
import { SignInInput } from "./dto/signin.dto";
import { EmailVerificationInput } from "./dto/email-verification.dto";
import { AuthService } from "./auth.service";
import { SignupInput } from "./dto/signup.dto";
import { Resolver, Mutation, Args } from "@nestjs/graphql";
import { isEmail } from "class-validator";
import { BadRequestException } from "@nestjs/common/exceptions";
import { UseGuards } from "@nestjs/common";

@Resolver()
export class AuthResolver {
    constructor(private authService: AuthService) {}

    @Mutation()
    signup(@Args("signupInput") signupInput: SignupInput): Promise<string> {
        return this.authService.signup(signupInput);
    }

    @Mutation()
    verify(
        @Args("emailVerificationInput")
        emailVerificationInput: EmailVerificationInput,
    ): Promise<string> {
        return this.authService.verifyEmail(emailVerificationInput);
    }

    @Mutation()
    signin(@Args("signinInput") signinInput: SignInInput) {
        return this.authService.signin(signinInput);
    }

    @Mutation()
    getResetPasswordOtp(@Args("email") email: string) {
        if (!isEmail(email)) {
            throw new BadRequestException("Email is invalid");
        }
        return this.authService.sendOtoToSpecificEmail(email);
    }

    @Mutation()
    resetPassword(
        @Args("resetPasswordInput") resetPasswordInput: ResetPasswordInput,
    ) {
        return this.authService.resetPassword(resetPasswordInput);
    }
}
