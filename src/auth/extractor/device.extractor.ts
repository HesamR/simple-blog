import { Request } from 'express';

export function extractDevice(req: Request) {
  return req.headers['user-agent'];
}
