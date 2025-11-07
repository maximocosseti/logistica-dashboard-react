// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect } from 'react';
import apiClient from '../services/api';

// 1. Crear el Contexto
const AuthContext = createContext(null);

// 2. Crear el "Proveedor" del Contexto
// Este componente envolverá nuestra app y proveerá el estado
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Guardará los datos del usuario (de /users/me)
  const [token, setToken] = useState(localStorage.getItem('accessToken') || null);
  const [loading, setLoading] = useState(true); // Para saber si estamos verificando el token

  // Efecto para cargar el usuario si ya tenemos un token (ej: si recarga la pág)
  useEffect(() => {
    const fetchUser = async () => {
      if (token) {
        try {
          // El interceptor de 'api.js' pondrá el token automáticamente
          const response = await apiClient.get('/users/me');
          setUser(response.data); // Guardamos los datos del usuario
        } catch (error) {
          // Token inválido o expirado
          console.error('Error al cargar el usuario:', error);
          setToken(null);
          localStorage.removeItem('accessToken');
        }
      }
      setLoading(false);
    };

    fetchUser();
  }, [token]);

  // --- Función de Login ---
  const login = async (username, password) => {
    try {
      // NOTA: FastAPI espera 'form-data' para /token, no JSON.
      const formData = new URLSearchParams();
      formData.append('username', username);
      formData.append('password', password);

      const response = await apiClient.post('/token', formData, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      });

      // --- INICIO DEL BLOQUE DE DEBUG (FRONTEND) ---
      // ¡Vamos a espiar la respuesta exitosa del backend!
      console.log("Respuesta del backend (200 OK):", response.data);
      // ---------------------------------------------

      // ¡Login exitoso!
      const { access_token } = response.data;
      localStorage.setItem('accessToken', access_token);
      setToken(access_token);
      
      // (El useEffect de arriba se disparará ahora
      // y llamará a /users/me para obtener los datos)

    } catch (error) {
      // Si algo falla DESPUÉS del console.log, el error está aquí.
      console.error('Error en el bloque catch del login:', error);
      throw new Error('Email o contraseña incorrectos');
    }
  };

  // --- Función de Logout ---
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('accessToken');
  };

  // 3. Valor que proveemos a los componentes "hijos"
  const value = {
    user,
    token,
    loading,
    login,
    logout,
  };

  // No renderizamos la app hasta que sepamos si estamos logueados o no
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// 4. Exportamos el contexto para usarlo en el Hook
export default AuthContext;