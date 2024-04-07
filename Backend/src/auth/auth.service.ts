import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import ms from 'ms';
import { CreateRegisterDto } from 'src/users/dto/create-user.dto';
import { IUser } from 'src/users/interface/user.interface';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
    constructor(private readonly userService:UsersService,private jwtService:JwtService,private readonly configService:ConfigService){}
    async validateUser(email: string, pass: string): Promise<any> {
      const user = await this.userService.findByEmail(email);
      if(user){
          const isValid=this.userService.checkPasswordValid(pass,user?.password);
          if(isValid){
             return user;
          }
      }
      return null;
    }
    async login(user: IUser) {
      const {_id,name,email,role}=user;
      const payload={
          sub:"token login",
          iss:'from server',
          _id,
          name,email,role
      }
      const refreshToken=this.createRefreshToken({name,email});
      return {
        access_token: this.jwtService.sign(payload),
        user:{
          _id,
          name,
          email,
          role
        },
        refreshToken
      };
    }
    async register(user:CreateRegisterDto){
       let newUser=await this.userService.register(user);
       console.log('<<<<<<< newUser >>>>>>>',newUser?.createdAt);
       return {
         _id:newUser?._id,
         createdAt:newUser?.createdAt
       }
    }
    createRefreshToken(payload){
         const refreshToken=this.jwtService.sign(payload,{  
            secret:this.configService.get<string>('JWT_SECRET_KEY_REFRESH_TOKEN'),
            expiresIn:ms(this.configService.get<string>('JWT_SECRET_KEY_EXPIRESIN_REFRESH_TOKEN'))/1000
         });
         return refreshToken;
    }

}
