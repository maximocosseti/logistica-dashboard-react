// src/components/AdminRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

function AdminRoute() {
  const { user, token, loading } = useAuth(); // Obtenemos el usuario del contexto

  // 1. Esperamos a que el AuthContext termine de cargar
  // (recuerda que llama a /users/me para obtener el 'user')
  if (loading) {
    return <div>Cargando...</div>;
  }

  // 2. Si no hay token, al Login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // 3. Si hay token, PERO el rol NO es 'admin',
  // lo enviamos al dashboard principal (acceso denegado)
  if (user && user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  // 4. Si hay token Y el rol es 'admin',
  // mostramos la página de admin
  return <Outlet />;
}

export default AdminRoute;