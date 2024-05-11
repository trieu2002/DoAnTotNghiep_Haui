import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Profile, Strategy } from "passport-facebook";
import { UsersService } from "src/users/users.service";

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, "facebook") {
  constructor(private configService:ConfigService,private readonly userService:UsersService) {
    super({
      clientID: configService.get<string>("CLIENT_ID_FACEBOOK"),
      clientSecret: configService.get<string>("CLIENT_SECRET_KEY_FACEBOOK"),
      callbackURL: configService.get<string>("CLIENT_REDIRECT_FACEBOOK"),
      scope: "email",
      profileFields: ["emails", "name"],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: (err: any, user: any, info?: any) => void
  ): Promise<any> {
    console.log('profile',profile);
    const type:string='FACEBOOK';
    const { name, emails, photos,id } = profile
    const dataRaw = {
      email: emails[0].value,
      username:`${name.givenName} ${name.familyName}`,
      googleId:id,
      accessToken
    }
    let user=await this.userService.upsertUserSocial(type,dataRaw);
    return done(null, user);
  }
}