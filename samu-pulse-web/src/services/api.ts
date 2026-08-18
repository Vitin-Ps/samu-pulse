import axios from 'axios';
import TokenService from './TokenService';

export function getBaseUrl() {
  return import.meta.env.VITE_API + "/api";
}

const api = axios.create({
  baseURL: getBaseUrl(),
});

api.interceptors.request.use(
  async config => {
    try {
      config.headers['bypass-tunnel-reminder'] = 'true';

      const token = TokenService.getToken();
      if (token) {
        const isValid = TokenService.validadeToken(token);
        if (isValid) {
          config.headers.Authorization = `Bearer ${token}`;
        } else {
          TokenService.removeToken();
        }
      }
    } catch (error) {
      console.error('Error retrieving token:', error);
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  },
);

export default api;
