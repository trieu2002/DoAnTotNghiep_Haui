import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './passport/local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './passport/jwt.strategy';
import ms from 'ms';
import { RolesModule } from 'src/roles/roles.module';
import { GoogleStrategy } from './passport/google.strategy';
import { FacebookStrategy } from './passport/facebook.strategy';

@Module({
  imports:[UsersModule,PassportModule,JwtModule.registerAsync({
    imports: [ConfigModule],
    useFactory: async (configService: ConfigService) => ({
      secret: configService.get<string>("JWT_SECRET_KEY"),
      signOptions: {
          expiresIn: ms(configService.get<string>("JWT_SECRET_KEY_EXPIRESIN"))/1000,
      },
    }),
    inject: [ConfigService],
  }),RolesModule],
  controllers: [AuthController],
  providers: [AuthService,LocalStrategy,JwtStrategy,GoogleStrategy,FacebookStrategy],
})
export class AuthModule {}
