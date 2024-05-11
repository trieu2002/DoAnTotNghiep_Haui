import { Controller, Post, UseGuards, Body, Res, Req, Get, HttpStatus, Param, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AUTH_ROUTE } from 'src/const/const';
import { LocalAuthGuard } from './guard/local-auth.guard';
import { DUser, Public, ResponseMessage } from 'src/core/core';
import { CreateRegisterDto } from 'src/users/dto/create-user.dto';
import { Response ,Request} from 'express';
import { IUser } from 'src/users/interface/user.interface';
import { RolesService } from 'src/roles/roles.service';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from 'src/users/users.service';
@Controller(AUTH_ROUTE)
export class AuthController {
  constructor(private readonly authService: AuthService,
    private readonly roleService:RolesService,
    private readonly userService:UsersService
  ) {}
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
  async handlerAccount(@DUser() user:IUser){
    const temp=await this.roleService.findOne(user.role._id) as any;
    console.log('temp',temp);
    user.permissions=temp.permissions;
    console.log('user',user);
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
  @Public()
  @UseGuards(AuthGuard('google'))
  @Get("/google")
  async googleAuth(@Req() req:Request) {
      return;
  }

  @Public()
  @UseGuards(AuthGuard('google'))
  @Get('/google/callback')
  googleAuthRedirect(@Req() req:Request,@Res() res: Response ) {
      return this.authService.googleAuthRedirect(req,res);
  }
  @Public()
  @ResponseMessage('Login google success')
  @Post("/loginGoogle-success")
  handlerLoginGoogle(@Body("id") id:string,@Req() req,@Res({ passthrough: true }) res: Response){
      return this.authService.loginGoogle(id,req,res);
         
  }
  @Public()
  @Get("/facebook")
  @UseGuards(AuthGuard("facebook"))
  async facebookLogin(): Promise<any> {
    return;
  }
  @Public()
  @Get("/facebook/callback")
  @UseGuards(AuthGuard("facebook"))
  async facebookLoginRedirect(@Req() req:Request,@Res() res: Response): Promise<any> {
    return this.authService.facebookLoginRedirect(req,res);
  }
  
  @Public()
  @ResponseMessage('Login google success')
  @Post("/loginFacebook-success")
  handlerLoginFacebook(@Body("idF") idF:string,@Req() req,@Res({ passthrough: true }) res: Response){
      return this.authService.loginFacebook(idF,req,res);
         
  }
 

}
 