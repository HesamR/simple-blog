import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { registerAs } from '@nestjs/config';

import { join } from 'path';

const isDevelopment = process.env.NODE_ENV !== 'production';

export default registerAs('mailer', () => ({
  transport: isDevelopment
    ? { jsonTransport: true }
    : process.env.MAILER_TRANSPORT,
  defaults: { from: '"No Reply" <no-reply@hesamr.top>' },
  template: {
    dir: join(__dirname, '../..', 'templates'),
    adapter: new HandlebarsAdapter(),
    options: { strict: true },
  },
  preview: isDevelopment,
}));
