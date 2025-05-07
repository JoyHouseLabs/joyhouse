import { Session } from 'express-session';

declare module 'express' {
  interface Request {
    session?: Session & { userId?: number };
  }
}
