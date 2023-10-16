import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { registerAs } from '@nestjs/config';

import { join } from 'path';
import { isDev } from './isDevMode';

export default registerAs('mailer', () => ({
  transport: isDev() ? { jsonTransport: true } : process.env.MAILER_TRANSPORT,
  defaults: { from: '"No Reply" <no-reply@hesamr.top>' },
  template: {
    dir: join(__dirname, '../..', 'templates'),
    adapter: new HandlebarsAdapter(),
    options: { strict: true },
  },
  preview: isDev(),
}));
