import { SetMetadata } from '@nestjs/common';
export const IS_PUBLIC_KEY:string = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const DUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
export const RESPONSE_MESSAGE:string='Response_Message';
export const ResponseMessage=(message:string)=>{
     SetMetadata(RESPONSE_MESSAGE,message);
}