const API_BASE_URL = (process.env.NEXT_PUBLIC_API_BASE_URL || '').replace(/\/$/, '');

export const buildApiUrl = (path) => `${API_BASE_URL}${path}`;

export const apiFetch = (path, options = {}) => {
  return fetch(buildApiUrl(path), {
    credentials: 'include',
    ...options,
    headers: {
      ...(options.headers || {}),
    },
  });
};
