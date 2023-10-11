import { UserSession } from '@prisma/client';
import { SessionPayload } from '../interface/session-payload.interface';

export function extractSessionPayload(session: UserSession): SessionPayload {
  return { id: session.id, expiresAt: session.expiresAt };
}
