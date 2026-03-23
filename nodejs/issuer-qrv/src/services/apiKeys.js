import { api } from './api.js';

export const getApiKeys = () => api.get('/api/api-keys');
