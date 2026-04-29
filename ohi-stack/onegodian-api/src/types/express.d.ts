import { MemberRole } from './domain';

declare global {
  namespace Express {
    interface Request {
      auth?: {
        userId: string;
        email: string;
        role: MemberRole;
      };
      rawBody?: Buffer;
    }
  }
}

export {};
