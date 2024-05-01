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
     return SetMetadata(RESPONSE_MESSAGE,message);
};
export const IS_PUBLIC_PERMISSION='IsPublicPermission';
export const SkipCheckPermission=()=> SetMetadata(IS_PUBLIC_PERMISSION,true);