import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { MailerOptions } from '@nestjs-modules/mailer';
import { registerAs } from '@nestjs/config';

import { join } from 'path';
import { isDev } from './isDevMode';

export default registerAs(
  'mailer',
  () =>
    ({
      transport: isDev()
        ? { jsonTransport: true }
        : {
            host: process.env.MAILER_HOST,
            port: process.env.MAILER_PORT,
            auth: {
              user: process.env.MAILER_USERNAME,
              pass: process.env.MAILER_PASSWORD,
            },
          },
      defaults: { from: '"No Reply" <no-reply@hesamr.top>' },
      template: {
        dir: join(__dirname, '../..', 'templates'),
        adapter: new HandlebarsAdapter(),
        options: { strict: true },
      },
      preview: isDev(),
    }) as MailerOptions,
);
