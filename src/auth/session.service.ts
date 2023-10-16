import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserSession } from '@prisma/client';
import { ConfigService } from '@nestjs/config';
import { Cron } from '@nestjs/schedule';

import { PrismaService } from 'src/prisma/prisma.service';

import { extractUserPayload } from 'src/user/extractor/user-payload.extractor';
import { extractSessionPayload } from './extractor/session-payload.extractor';

import * as ms from 'ms';

@Injectable()
export class SessionService {
  maxAge: number;

  constructor(
    private prismaService: PrismaService,
    private configService: ConfigService,
  ) {
    this.maxAge = ms(this.configService.get('auth.ttl.session'));
  }

  async createOrUpdate(userId: number, device: string): Promise<UserSession> {
    const expiresAt = new Date(Date.now() + this.maxAge);

    return this.prismaService.userSession.upsert({
      where: { userId_device: { userId, device } },
      update: { expiresAt },
      create: { userId, device, expiresAt },
    });
  }

  async verify(id: string, device: string) {
    const session = await this.prismaService.userSession.findUnique({
      where: { id, device },
      include: { user: true },
    });

    if (!session)
      throw new UnauthorizedException(
        'no active session found for this device',
      );

    const timeLeft = session.expiresAt.getTime() - Date.now();

    if (timeLeft <= 0) {
      this.prismaService.userSession.delete({ where: { id } });
      throw new UnauthorizedException('session expired');
    }

    const userPayload = extractUserPayload(session.user);
    const sessionPayload = extractSessionPayload(session);

    return { user: userPayload, session: sessionPayload };
  }

  async deleteById(id: string) {
    await this.prismaService.userSession.delete({ where: { id } });
  }

  @Cron('0 0 * * *')
  async handleOutdatedSessions() {
    await this.prismaService.userSession.deleteMany({
      where: { expiresAt: { lt: new Date() } },
    });
  }
}
