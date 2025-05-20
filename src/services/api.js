import axios from 'axios';

const baseURL = process.env.REACT_APP_API_URL || '';

const api = axios.create({
    baseURL,
    headers: {
        'Content-Type': 'application/json'
    }
});
// Interceptor para incluir token de autenticación (si existe)
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);
// Interceptor para manejar errores comunes

api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Aquí puedes manejar errores comunes, como 401 (no autorizado)
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);
export default api;