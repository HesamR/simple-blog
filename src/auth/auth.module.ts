import { Global, Module, forwardRef } from '@nestjs/common';

import { UserModule } from 'src/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import { MailerModule } from '@nestjs-modules/mailer';

import { AuthController } from './auth.controller';

import { AuthService } from './auth.service';
import { SessionService } from './session.service';
import { SessionGuard } from './guard/session.guard';

@Global()
@Module({
  imports: [
    forwardRef(() => UserModule),
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('auth.secret'),
      }),
      inject: [ConfigService],
    }),
    MailerModule,
  ],

  controllers: [AuthController],

  providers: [AuthService, SessionService, SessionGuard],

  exports: [AuthService, SessionGuard],
})
export class AuthModule {}
