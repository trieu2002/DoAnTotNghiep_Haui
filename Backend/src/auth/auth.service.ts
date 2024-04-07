import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateRegisterDto } from 'src/users/dto/create-user.dto';
import { IUser } from 'src/users/interface/user.interface';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
    constructor(private readonly userService:UsersService,private jwtService:JwtService){}
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
      return {
        access_token: this.jwtService.sign(payload),
        _id,
        name,
        email,
        role
      };
    }
    async register(user:CreateRegisterDto){
        let newUser=await this.userService.register(user);
        return {
            _id:newUser?._id,
            createdAt:newUser?.createdAt
        }
    }
}
