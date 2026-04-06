import { api } from './api.js';

export const createRecord = (payload) => api.post('/api/records', payload);
export const verifyRecord = (qrvid) => api.get(`/api/verify/${encodeURIComponent(qrvid)}`);
export const revokeRecord = ({ qrvid, ...payload }) =>
  api.post(`/api/records/${encodeURIComponent(qrvid)}/revoke`, payload);
