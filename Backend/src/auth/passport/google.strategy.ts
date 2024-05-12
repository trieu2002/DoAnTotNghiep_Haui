import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersService } from 'src/users/users.service';
@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {

  constructor(private configService:ConfigService,private readonly userService:UsersService) {
    super({
      clientID: configService.get<string>("CLIENT_ID_GOOGLE"),
      clientSecret: configService.get<string>("CLIENT_SECRET_KEY"),
      callbackURL:  configService.get<string>("CLIENT_REDIRECT"),
      scope: ['email', 'profile'],
    
    });
  }

  async validate (accessToken: string, refreshToken: string, profile: any, done: VerifyCallback): Promise<any> {
    console.log('profile',profile);
    const type:string='GOOGLE';
    const { name, emails, photos,displayName,id } = profile
    const dataRaw = {
      email: emails[0].value,
      username:displayName,
      googleId:id,
      accessToken
    }
    let user=await this.userService.upsertUserSocial(type,dataRaw);
    console.log(user,'usrehihihi')
    return done(null, user);
  }
}