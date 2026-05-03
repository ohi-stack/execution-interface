export type Role = 'user'|'member'|'admin';
export interface ModuleCard { slug:string; title:string; description:string; roles:Role[]; }
