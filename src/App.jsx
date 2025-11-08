// src/App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import AdminPage from './pages/AdminPage';
// ¡Importar la nueva página de selección!
import RouteSelectionPage from './pages/RouteSelectionPage';

function App() {
  return (
    <div>
      <Routes>
        {/* Ruta Pública */}
        <Route path="/login" element={<LoginPage />} />
        
        {/* Rutas Protegidas (Repartidor y Admin) */}
        <Route element={<ProtectedRoute />}>
          {/* La raíz (/) ahora es la selección de ruta */}
          <Route path="/" element={<RouteSelectionPage />} />
          {/* El Dashboard ahora es dinámico */}
          <Route path="/dashboard/:routeId" element={<DashboardPage />} />
        </Route>
        
        {/* Rutas Protegidas (Solo Admin) */}
        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<AdminPage />} />
        </Route>

      </Routes>
    </div>
  );
}

export default App;