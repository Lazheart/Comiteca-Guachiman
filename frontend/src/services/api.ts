import axios from 'axios';

/**
 * Instancia central de Axios configurada con la base URL de la API.
 * Todas las peticiones deben pasar por este cliente.
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Interceptor para manejar errores globales de red
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // El servidor respondió con un código de error
      console.error('[API Error]', error.response.status, error.response.data);
    } else if (error.request) {
      // La petición se hizo pero no hubo respuesta
      console.error('[API Error] No response received', error.request);
    } else {
      // Error al configurar la petición
      console.error('[API Error]', error.message);
    }
    return Promise.reject(error);
  },
);

export default api;
