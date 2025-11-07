// src/App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ProtectedRoute from './components/ProtectedRoute';

// --- 1. Importar los nuevos componentes ---
import AdminRoute from './components/AdminRoute';
import AdminPage from './pages/AdminPage';

function App() {
  return (
    <div>
      <Routes>
        {/* --- Rutas Públicas --- */}
        <Route path="/login" element={<LoginPage />} />
        
        {/* --- Rutas Protegidas (Repartidor y Admin) --- */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<DashboardPage />} />
        </Route>
        
        {/* --- Rutas Protegidas (Solo Admin) --- */}
        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<AdminPage />} />
        </Route>

      </Routes>
    </div>
  );
}

export default App;