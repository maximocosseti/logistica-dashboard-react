// src/pages/RouteSelectionPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../services/api';
import { useAuth } from '../hooks/useAuth';
import './RouteSelectionPage.css'; // Crearemos este CSS

function RouteSelectionPage() {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        // Llama al endpoint que sí existe (verificado en su auditoría)
        const response = await apiClient.get('/routes/me');
        setRoutes(response.data);
      } catch (err) {
        console.error('Error al cargar las rutas:', err);
        setError('No se pudieron cargar tus rutas asignadas.');
      } finally {
        setLoading(false);
      }
    };
    fetchRoutes();
  }, []);

  const handleRouteClick = (routeId) => {
    navigate(`/dashboard/${routeId}`); // Navegación dinámica
  };

  return (
    <div className="route-selection-container">
      <header className="route-selection-header">
        <h2>Bienvenido, {user?.full_name || 'Repartidor'}</h2>
        <button onClick={logout} className="logout-btn">
          Cerrar Sesión
        </button>
      </header>

      <div className="route-selection-card">
        <h3>Tus Rutas Asignadas</h3>
        {loading && <p>Cargando rutas...</p>}
        {error && <p className="error-message">{error}</p>}
        
        {!loading && !error && (
          <div className="routes-list">
            {routes.length > 0 ? (
              routes.map((route) => (
                <button 
                  key={route.id} 
                  className="route-item-btn"
                  onClick={() => handleRouteClick(route.id)}
                >
                  <span>{route.name}</span>
                  <span className="route-status">{route.status}</span>
                </button>
              ))
            ) : (
              <p>No tienes rutas asignadas.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default RouteSelectionPage;