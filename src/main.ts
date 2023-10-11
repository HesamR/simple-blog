import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { AppModule } from './app.module';

import helmet from 'helmet';
import * as cookieParser from 'cookie-parser';
import * as compression from 'compression';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({ credentials: true, origin: true });
  app.setGlobalPrefix('api/v1');

  const configService = app.get(ConfigService);

  app.use(helmet());
  app.use(compression());
  app.use(cookieParser(configService.get('COOKIE_SECRET')));

  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  await app.listen(3000);
}
bootstrap();
