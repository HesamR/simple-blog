import { Role } from '@prisma/client';

export interface UserPayload {
  id: number;
  email: string;
  role: Role;
}
