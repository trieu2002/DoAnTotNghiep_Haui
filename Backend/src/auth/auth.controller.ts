import { Controller, Post, UseGuards,Request, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AUTH_ROUTE } from 'src/const/const';
import { LocalAuthGuard } from './guard/local-auth.guard';
import { Public, ResponseMessage } from 'src/core/core';
import { CreateRegisterDto } from 'src/users/dto/create-user.dto';
@Controller(AUTH_ROUTE)
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Public()
  @UseGuards(LocalAuthGuard)
  @ResponseMessage('Login user')
  @Post("/login")
  handlerLogin(@Request() req){
    return this.authService.login(req.user);
  }
  @Public()
  @ResponseMessage('Register a new user')
  @Post("/register")
  handlerRegister(@Body() registerUserDto:CreateRegisterDto){
    return this.authService.register(registerUserDto);
  }
  
}
