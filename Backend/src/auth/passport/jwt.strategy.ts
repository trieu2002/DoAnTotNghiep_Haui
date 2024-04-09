import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IUser } from 'src/users/interface/user.interface';
import { RolesService } from 'src/roles/roles.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService:ConfigService,private readonly roleService:RolesService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>("JWT_SECRET_KEY"),
    });
  }

  async validate(payload: IUser) {
     const {_id,name,email,role}=payload;
     const userRole=role as unknown as {_id:string,name:string};
     const temp=(await this.roleService.findOne(userRole?._id)).toObject(); 
     return {
        _id,
        name,
        email,
        role,
        permissions:temp?.permissions ?? []
     }
  }
}