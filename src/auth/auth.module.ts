import { PatientJwtStrategy } from './strategies/patient.strategy';
import { SesManagerService } from './../ses-manager/ses-manager.service';
import { User, UserSchema } from './../schemas/user.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthService } from './auth.service';
import { Module } from '@nestjs/common';
import { AuthResolver } from './auth.resolver';

@Module({
  imports: [MongooseModule.forFeature([{name: User.name, schema: UserSchema}])],
  providers: [AuthResolver, AuthService, SesManagerService, PatientJwtStrategy]
})
export class AuthModule {}
