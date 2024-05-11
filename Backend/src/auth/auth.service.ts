import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import ms from 'ms';
import { CreateRegisterDto } from 'src/users/dto/create-user.dto';
import { IUser } from 'src/users/interface/user.interface';
import { UsersService } from 'src/users/users.service';
import {Response,Request} from 'express';
import { RolesService } from 'src/roles/roles.service';


@Injectable()
export class AuthService {
    constructor(private readonly userService:UsersService,private jwtService:JwtService,private readonly configService:ConfigService,private roleModel:RolesService){}
    async validateUser(email: string, pass: string): Promise<any> {
      const user = await this.userService.findByEmail(email);
      if(user){
          const isValid=this.userService.checkPasswordValid(pass,user?.password);
          
          if(isValid){
            const userRole=user.role as unknown as {_id:string,name:string};
            const temp=await this.roleModel.findOne(userRole?._id);
            const objUser={
               ...user.toObject(),
               permissions:temp?.permissions ?? []
            }
            return objUser;
          }
         
      }
      return null;
    }
    async login(user: IUser,res:Response) {
      const {_id,name,email,address,age,gender,role,permissions}=user;
      const payload={
          sub:"token login",
          iss:'from server',
          _id,
          name,email,role,
          address,gender,age
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
          address,
          age,
          gender,
          role
        },
        permissions
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
               const {_id,name,email,role,address,age,gender}=user;
               const payload={
                   sub:"token login",
                   iss:'from server',
                   _id,
                   name,email,role,
                   address,
                   age,gender
               }
               const refreshToken=this.createRefreshToken(payload);
               // update save db refresh token
               await this.userService.updateRefreshToken(refreshToken,_id.toString());
               const userRole=user.role as unknown as {_id:string,name:string};
               const temp=await this.roleModel.findOne(userRole._id);
               res.clearCookie('refreshToken');
               res.cookie('refreshToken',refreshToken,{
                maxAge:ms(this.configService.get<string>('JWT_SECRET_KEY_EXPIRESIN_REFRESH_TOKEN')),
                httpOnly:true
              });
              return {
                access_token: this.jwtService.sign(payload),
                user:{
                  _id,
                  name,
                  email,
                  role,
                  gender,
                  age,
                  address
                  
                },
                permissions:temp?.permissions ?? []
              };

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
    async googleAuthRedirect(req:Request,res:Response){
      const user:IUser=req.user;
      if(user){
         return res.redirect(`http://localhost:3000/login?id=${user?._id}`);
      }else{
        return res.redirect(`http://localhost:3000/login`);
      }
    }
    async loginGoogle(id: string, req: Request, res: Response) {
      const user = await this.userService.findUserLoginGoogle(id);
      const { _id, name, email, role, permissions } = user;
      const payload = {
          sub: "token login",
          iss: 'from server',
          _id,
          name,
          email,
          role
      }
      const token = this.jwtService.sign(payload);
      console.log('token', token);
  
      const refreshToken = this.createRefreshToken(payload);
      // update save db refresh token
      await this.userService.updateRefreshToken(refreshToken, _id.toString());
      // set cookie refresh token
      res.cookie('refreshToken', refreshToken, {
          maxAge: ms(this.configService.get<string>('JWT_SECRET_KEY_EXPIRESIN_REFRESH_TOKEN')),
          httpOnly: true
      })
      return {
          access_token: token,
          user: {
              _id,
              name,
              email,
              role
          },
          permissions
      };
  }
  async facebookLoginRedirect(req:Request,res:Response){
    const user:IUser=req.user;
    if(user){
       return res.redirect(`http://localhost:3000/login?idF=${user?._id}`);
    }else{
      return res.redirect(`http://localhost:3000/login`);
    }
  }
  async loginFacebook(idF: string, req: Request, res: Response){
    const user = await this.userService.findUserLoginFacebook(idF);
    const { _id, name, email, role, permissions } = user;
    const payload = {
        sub: "token login",
        iss: 'from server',
        _id,
        name,
        email,
        role
    }
    const token = this.jwtService.sign(payload);
    console.log('token', token);

    const refreshToken = this.createRefreshToken(payload);
    // update save db refresh token
    await this.userService.updateRefreshToken(refreshToken, _id.toString());
    // set cookie refresh token
    res.cookie('refreshToken', refreshToken, {
        maxAge: ms(this.configService.get<string>('JWT_SECRET_KEY_EXPIRESIN_REFRESH_TOKEN')),
        httpOnly: true
    })
    return {
        access_token: token,
        user: {
            _id,
            name,
            email,
            role
        },
        permissions
    };
  }
   

}
