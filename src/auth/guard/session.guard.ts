import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { AuthService } from '../auth.service';

import { extractDevice } from '../extractor/device.extractor';

import { Request } from 'express';

@Injectable()
export class SessionGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest() as Request;

    const device = extractDevice(request);
    const sessionId = request.signedCookies['session'];

    if (!sessionId) throw new UnauthorizedException('session was not found');

    const { user, session } = await this.authService.verifySession(
      sessionId,
      device,
    );

    request['user'] = user;
    request['session'] = session;

    return true;
  }
}
