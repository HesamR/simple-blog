import { registerAs } from '@nestjs/config';

export default registerAs('auth', () => ({
  secret: process.env.JWT_SECRET,
  ttl: {
    access: '5m',
    forgetPassword: '5m',
    verifyEmail: '5m',
    session: '30d',
  },
}));
