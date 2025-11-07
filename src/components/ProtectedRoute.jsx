// src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

function ProtectedRoute() {
  const { token, loading } = useAuth(); // Obtenemos el token de nuestro contexto

  // 1. Esperamos a que el contexto termine de cargar
  // (Evita redirigir al login si solo está verificando un token existente)
  if (loading) {
    return <div>Cargando...</div>;
  }

  // 2. Si terminó de cargar y NO hay token, redirigimos al login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // 3. Si terminó de cargar y SÍ hay token, mostramos la página solicitada
  // <Outlet /> es el "espacio" donde React Router pondrá el 
  // componente que estamos protegiendo (ej: DashboardPage)
  return <Outlet />;
}

export default ProtectedRoute;