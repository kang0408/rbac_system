import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const api = axios.create({
  baseURL: `${import.meta.env.VITE_BASE_URL}/api/v1`,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem('rbac_system_access_token');
    config.headers.Authorization = `Bearer ${JSON.parse(accessToken)}`;

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (res) => {
    return res;
  },
  (error) => {
    if (error.status == 401) {
      const naviagate = useNavigate();
      naviagate('/auth/login');
    }
    return Promise.reject(error);
  }
);

export default api;
