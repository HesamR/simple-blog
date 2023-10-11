import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export const Cookies = createParamDecorator(
  (key: string, ctx: ExecutionContext): string => {
    const req = ctx.switchToHttp().getRequest() as Request;
    return key ? req.cookies?.[key] : req.cookies;
  },
);

export const SignedCookies = createParamDecorator(
  (key: string, ctx: ExecutionContext): string => {
    const req = ctx.switchToHttp().getRequest() as Request;
    return key ? req.signedCookies?.[key] : req.signedCookies;
  },
);
