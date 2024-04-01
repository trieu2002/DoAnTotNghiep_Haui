import { Controller, Post, UseGuards,Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AUTH_ROUTE } from 'src/const/const';
import { LocalAuthGuard } from './guard/local-auth.guard';
@Controller(AUTH_ROUTE)
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @UseGuards(LocalAuthGuard)
  @Post("/login")
  handlerLogin(@Request() req){
    return this.authService.login(req.user);
  }
  
}
