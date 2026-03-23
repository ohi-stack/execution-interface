import { api } from './api.js';

export const getRecords = () => api.get('/api/records');
