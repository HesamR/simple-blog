import { User } from '@prisma/client';
import { UserPayload } from '../interface/user-payload.interface';

export function extractUserPayload(user: User): UserPayload {
  return { id: user.id, role: user.role, email: user.email };
}
