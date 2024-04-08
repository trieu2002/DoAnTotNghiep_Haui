import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import ms from 'ms';
import { CreateRegisterDto } from 'src/users/dto/create-user.dto';
import { IUser } from 'src/users/interface/user.interface';
import { UsersService } from 'src/users/users.service';
import {Response} from 'express';
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
    async login(user: IUser,res:Response) {
      const {_id,name,email,role}=user;
      const payload={
          sub:"token login",
          iss:'from server',
          _id,
          name,email,role
      }
        const refreshToken=this.createRefreshToken(payload);
        // update save db refresh token
        await this.userService.updateRefreshToken(refreshToken,_id);
      // set cookie refesh token
      res.cookie('refreshToken',refreshToken,{
        maxAge:ms(this.configService.get<string>('JWT_SECRET_KEY_EXPIRESIN_REFRESH_TOKEN')),
        httpOnly:true
      })
      return {
        access_token: this.jwtService.sign(payload),
        user:{
          _id,
          name,
          email,
          role
        },
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
    async processNewToken(refreshToken:string,res:Response){
        try {
           // giair max token laay tu cookie
           this.jwtService.verify(refreshToken,{
              secret:this.configService.get<string>('JWT_SECRET_KEY_REFRESH_TOKEN')
           })
           // tdodo
           let user=await this.userService.findUserByToken(refreshToken);
           if(user){
               // update refresh token 
               const {_id,name,email,role}=user;
               const payload={
                   sub:"token login",
                   iss:'from server',
                   _id,
                   name,email,role
               }
               const refreshToken=this.createRefreshToken(payload);
               // update save db refresh token
               await this.userService.updateRefreshToken(refreshToken,_id.toString());
               res.clearCookie('refreshToken');
               res.cookie('refreshToken',refreshToken,{
                maxAge:ms(this.configService.get<string>('JWT_SECRET_KEY_EXPIRESIN_REFRESH_TOKEN')),
                httpOnly:true
              })
           }else{
              throw new BadRequestException('Token không hơp lệ or hết hạn')
           }
        } catch (error) {
           throw new BadRequestException('Token không hơp lệ or hết hạn')
        }
    }
    async logout(user:IUser,res:Response){
        await this.userService.updateRefreshToken("",user?._id);
        res.clearCookie('refreshToken');
        return 'OK'; 
    }

}
