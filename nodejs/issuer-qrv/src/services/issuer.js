import { api } from './api.js';

export const createRecord = (payload) => api.post('/api/registry/create', payload);
export const verifyRecord = (qrvid) => api.get(`/api/verify/${encodeURIComponent(qrvid)}`);
export const revokeRecord = (payload) => api.post('/api/revoke', payload);
