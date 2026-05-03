import { Role } from './types';
export interface AppSession { userId: string; role: Role; email: string; }
export async function getSession(): Promise<AppSession> {
  return { userId: 'demo-user', role: 'admin', email: 'admin@onegodian.com' };
}
export function canAccess(required: Role[], actual: Role): boolean { return required.includes(actual) || actual === 'admin'; }
