import { Controller, Post, UseGuards, Body, Res, Req, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AUTH_ROUTE } from 'src/const/const';
import { LocalAuthGuard } from './guard/local-auth.guard';
import { DUser, Public, ResponseMessage } from 'src/core/core';
import { CreateRegisterDto } from 'src/users/dto/create-user.dto';
import { Response ,Request} from 'express';
import { IUser } from 'src/users/interface/user.interface';
@Controller(AUTH_ROUTE)
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Public()
  @UseGuards(LocalAuthGuard)
  @ResponseMessage('Login user')
  @Post("/login")
  handlerLogin(@Req() req,@Res({ passthrough: true }) res: Response){
    return this.authService.login(req.user,res);
  }
  @Public()
  @ResponseMessage('Register a new user')
  @Post("/register")
  handlerRegister(@Body() registerUserDto:CreateRegisterDto){
    return this.authService.register(registerUserDto);
  }
  @ResponseMessage('Get info user')
  @Get('/account')
  handlerAccount(@DUser() user:IUser){
    return {user};
  }
  @Public()
  @ResponseMessage("Handler refresh token")
  @Post('/refresh')
  handlerRefreshToken(@Req() req:Request,@Res({ passthrough: true }) res: Response){
     const refreshToken=req.cookies['refreshToken'];
     return this.authService.processNewToken(refreshToken,res);
  }
  @ResponseMessage('Logout user')
  @Post('/logout')
  handlerLogout(@DUser() user:IUser,@Res({ passthrough: true }) res: Response){
     return this.authService.logout(user,res);
  }
}
