import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';

import { MailerService } from '@nestjs-modules/mailer';
import { JwtService } from '@nestjs/jwt';

import { UserService } from 'src/user/user.service';
import { SessionService } from './session.service';

import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ForgetPasswordDto } from './dto/forget-password.dto';
import { ForgetPasswordValidateDto } from './dto/forget-password-validate.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';

import { extractUserPayload } from 'src/user/extractor/user-payload.extractor';
import { UserPayload } from 'src/user/interface/user-payload.interface';

import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { ChangeEmailDto } from './dto/change-email.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private sessionService: SessionService,
    private jwtService: JwtService,
    private mailerService: MailerService,
    private configService: ConfigService,
  ) {}

  async login({ email, password, rememberMe }: LoginDto, device: string) {
    const user = await this.userService.findByEmail(email);

    const doesPasswordMatch =
      user && (await bcrypt.compare(password, user.password));

    if (user && doesPasswordMatch) {
      const accessTokenPromise = this.jwtService.sign(
        extractUserPayload(user),
        { expiresIn: this.configService.getOrThrow('auth.ttl.access') },
      );

      const sessionPromise = rememberMe
        ? this.sessionService.createOrUpdate(user.id, device)
        : Promise.resolve(null);

      const [accessToken, session] = await Promise.all([
        accessTokenPromise,
        sessionPromise,
      ]);

      return { accessToken, session, user };
    }

    throw new UnauthorizedException("username and password doesn't match");
  }

  async logout(sessionId: string) {
    this.sessionService.deleteById(sessionId);
  }

  async register(registerDto: RegisterDto) {
    const user = await this.userService.create(registerDto);
    if (!user) throw new BadRequestException('email already exist');
  }

  async changePassword(
    userId: number,
    { oldPassword, newPassword }: ChangePasswordDto,
  ) {
    const user = await this.userService.findById(userId);

    if (!user || !(await bcrypt.compare(oldPassword, user.password))) {
      throw new BadRequestException('wrong password');
    }

    await this.userService.updatePassword(user.id, newPassword);
  }

  async changeEmail(userId: number, { email }: ChangeEmailDto) {
    await this.userService.updateEmail(userId, email);
  }

  async isEmailVerified(userId: number): Promise<boolean> {
    const user = await this.userService.findById(userId, { setting: true });
    if (user) return user.setting.isEmailVerified;
    else throw new BadRequestException('no user found');
  }

  async forgetPassword(host: string, { email }: ForgetPasswordDto) {
    const user = await this.userService.findByEmail(email, {
      setting: true,
    });

    if (user && user.setting.isEmailVerified) {
      const token = await this.jwtService.signAsync(
        { id: user.id },
        { expiresIn: this.configService.get('auth.ttl.forgetPassword') },
      );

      const url = `https://${host}/forget-password-complete?token=${token}`;

      await this.mailerService.sendMail({
        to: email,
        subject: 'Forget Password',
        template: 'forget-password',
        context: { url },
      });
    }
  }

  async forgetPasswordComplete({
    token,
    newPassword,
  }: ForgetPasswordValidateDto) {
    try {
      const { id } = await this.jwtService.verifyAsync(token);
      await this.userService.updatePassword(id, newPassword);
    } catch {
      throw new BadRequestException('bad token');
    }
  }

  async sendVerifyEmail(userId: number, host: string) {
    const user = await this.userService.findById(userId, {
      setting: true,
    });

    if (user && !user.setting.isEmailVerified) {
      const token = await this.jwtService.signAsync(
        { id: user.id },
        { expiresIn: this.configService.get('auth.ttl.verifyEmail') },
      );

      const url = `https://${host}/verify-email?token=${token}`;

      await this.mailerService.sendMail({
        to: user.email,
        subject: 'Verify Email',
        template: 'verify-email',
        context: { url },
      });
    }
  }

  async verifyEmail({ token }: VerifyEmailDto): Promise<boolean> {
    try {
      const { id } = await this.jwtService.verify(token);
      await this.userService.verifyEmail(id);
    } catch {
      throw new BadRequestException('bad token');
    }

    return true;
  }

  async refresh(payload: UserPayload) {
    return this.jwtService.sign(payload, { expiresIn: '5m' });
  }

  async verifyAccessToken(token: string): Promise<UserPayload> {
    try {
      const { exp, iat, ...payload } = await this.jwtService.verifyAsync(token);

      return payload;
    } catch {
      throw new UnauthorizedException('failed to verify token');
    }
  }

  async verifySession(sessionId: string, device: string) {
    return this.sessionService.verify(sessionId, device);
  }
}
