import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { Request } from 'express';
import { AuthService } from '../auth.service';

@Injectable()
export class JWTGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest() as Request;

    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    if (type !== 'Bearer' && !token)
      throw new UnauthorizedException('access token not found');

    request['user'] = await this.authService.verifyAccessToken(token);

    return true;
  }
}
