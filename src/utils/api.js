import axios from 'axios';
import { useAuth } from '../AuthContext';

// Create an Axios instance
const api = axios.create();

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const auth = useAuth();
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const newAccessToken = await auth.refreshAccessToken();
      if (newAccessToken) {
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
