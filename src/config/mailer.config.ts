import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { registerAs } from '@nestjs/config';

import { join } from 'path';

export default registerAs('mailer', () => ({
  transport: { jsonTransport: true },
  defaults: { from: '"No Reply" <no-reply@localhost>' },
  template: {
    dir: join(__dirname, '../..', 'templates'),
    adapter: new HandlebarsAdapter(),
    options: { strict: true },
  },
  preview: true,
}));
