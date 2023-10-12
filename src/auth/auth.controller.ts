import {
  Body,
  Controller,
  Get,
  Post,
  Res,
  UseGuards,
  Session,
  Headers,
} from '@nestjs/common';
import { Throttle, minutes } from '@nestjs/throttler';

import { AuthService } from './auth.service';

import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

import { SessionGuard } from './guard/session.guard';
import { JWTGuard } from './guard/jwt.guard';
import { CurrentUser } from './decorator/current-user.decorator';
import { Device } from './decorator/device.decorator';

import { ChangePasswordDto } from './dto/change-password.dto';
import { ForgetPasswordDto } from './dto/forget-password.dto';
import { ForgetPasswordValidateDto } from './dto/forget-password-validate.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';

import { Response } from 'express';
import { SessionPayload } from './interface/session-payload.interface';
import { UserPayload } from 'src/user/interface/user-payload.interface';
import { extractUserPayload } from 'src/user/extractor/user-payload.extractor';
import { ChangeEmailDto } from './dto/change-email.dto';

@Controller('auth')
@Throttle({ default: { limit: 10, ttl: minutes(1) } })
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(
    @Res({ passthrough: true }) res: Response,
    @Body() loginDto: LoginDto,
    @Device() device: string,
  ) {
    const { accessToken, session, user } = await this.authService.login(
      loginDto,
      device,
    );

    if (session) {
      res.cookie('session', session.id, {
        expires: session.expiresAt,
        sameSite: 'none',
        httpOnly: true,
        signed: true,
      });
    }

    return { accessToken, user: extractUserPayload(user) };
  }

  @Post('logout')
  @UseGuards(SessionGuard)
  async logout(
    @Res({ passthrough: true }) res: Response,
    @Session() session: SessionPayload,
  ) {
    await this.authService.logout(session.id);

    res.clearCookie('session', {
      expires: session.expiresAt,
      sameSite: 'none',
      httpOnly: true,
      signed: true,
    });
  }

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    await this.authService.register(registerDto);
  }

  @Post('change-password')
  @UseGuards(JWTGuard)
  async changePassword(
    @CurrentUser() user: UserPayload,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    await this.authService.changePassword(user.id, changePasswordDto);
  }

  @Post('change-email')
  @UseGuards(JWTGuard)
  async changeEmail(
    @CurrentUser() user: UserPayload,
    @Body() changeEmailDto: ChangeEmailDto,
  ) {
    await this.authService.changeEmail(user.id, changeEmailDto);
  }

  @Get('is-email-verified')
  @UseGuards(JWTGuard)
  async isEmailVerified(@CurrentUser() user: UserPayload) {
    return this.authService.isEmailVerified(user.id);
  }

  @Post('forget-password')
  async forgetPassword(
    @Headers('host') host: string,
    @Body() forgetPasswordDto: ForgetPasswordDto,
  ) {
    return this.authService.forgetPassword(host, forgetPasswordDto);
  }

  @Post('forget-password-complete')
  async forgetPasswordComplete(
    @Body() forgetPasswordValidateDto: ForgetPasswordValidateDto,
  ) {
    await this.authService.forgetPasswordComplete(forgetPasswordValidateDto);
  }

  @Post('send-verify-email')
  @UseGuards(JWTGuard)
  async sendVerifyEmail(
    @CurrentUser() user: UserPayload,
    @Headers('host') host: string,
  ) {
    return this.authService.sendVerifyEmail(user.id, host);
  }

  @Post('verify-email')
  async verfyEmail(@Body() verifyEmailDto: VerifyEmailDto) {
    return this.authService.verifyEmail(verifyEmailDto);
  }

  @Get('refresh')
  @UseGuards(SessionGuard)
  async refresh(@CurrentUser() user: UserPayload) {
    const accessToken = await this.authService.refresh(user);
    return { accessToken, user };
  }
}
