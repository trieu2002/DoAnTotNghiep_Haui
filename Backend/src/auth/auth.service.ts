import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
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
    async login(user: any) {
      const payload = { username: user.username, sub: user.userId };
      return {
        access_token: this.jwtService.sign(payload),
      };
    }
}
