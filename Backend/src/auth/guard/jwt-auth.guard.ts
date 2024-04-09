import {
    ExecutionContext,
    ForbiddenException,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { IS_PUBLIC_KEY } from 'src/core/core';
  
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    constructor(private reflector: Reflector) {
        super();
    }
    canActivate(context: ExecutionContext) {
        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
          context.getHandler(),
          context.getClass(),
        ]);
        if (isPublic) {
          return true;
        }
        return super.canActivate(context);
    }
    handleRequest(err, user, info,context:ExecutionContext) {
      // You can throw an exception based on either "info" or "err" arguments
       const request:Request=context.switchToHttp().getRequest();
       console.log(user);
      if (err || !user) {
        throw err || new UnauthorizedException('Token hết hạn or token không hợp lệ!');
      }
      const targetMethod=request.method;
      const targetEndpoint=request?.route.path as string;
      const permissions=user?.permissions ?? [];
      console.log('<<<<<<< targetMethod >>>>>>>',targetMethod);
      console.log('<<<<<<< targetEndpoint >>>>>>>',targetEndpoint);
      console.log('<<<<<<< permissions >>>>>>>',permissions);
      let persists=permissions.some(permission=> targetMethod===permission.method &&targetEndpoint===permission.apiPath);

     if(targetEndpoint.startsWith('/api/v1/auth')) persists=true;
      if(!persists){
         throw new ForbiddenException('Bạn không có quyền truy cập resource này');
      }

      return user;
    }
}