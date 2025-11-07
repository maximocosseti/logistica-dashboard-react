// src/services/api.js
import axios from 'axios';

// Creamos una instancia de Axios
const apiClient = axios.create({
  // Esta es la URL de tu backend FastAPI
  baseURL: import.meta.env.VITE_API_BASE_URL, 
  headers: {
    'Content-Type': 'application/json',
  },
});

/*
  Interceptor de Petición (¡Importante!)
  
  Esto intercepta CADA petición que hagamos (ej: GET /users/me)
  y le "inyecta" el token de autenticación en la cabecera
  si es que lo tenemos guardado.
*/
apiClient.interceptors.request.use(
  (config) => {
    // Obtenemos el token de localStorage (que guardaremos al hacer login)
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;