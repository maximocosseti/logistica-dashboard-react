// src/pages/DashboardPage.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import apiClient from '../services/api';

// --- 1. Importaciones corregidas ---
import { useParams, Link } from 'react-router-dom';

import MapComponent from '../components/MapComponent';
import StopItem from '../components/StopItem';
import ConfirmModal from '../components/ConfirmModal';
import './DashboardPage.css';

// Componente de Notificación (sin cambios)
const Notification = ({ message, type = 'success' }) => {
  if (!message) return null;
  const backgroundStyle = () => {
    switch (type) {
      case 'success': return 'var(--electric-blue-gradient)';
      case 'error': return 'linear-gradient(135deg, #DC2626, #991B1B)';
      case 'info': return 'linear-gradient(135deg, #3B82F6, #2563EB)';
      default: return 'var(--electric-blue-gradient)';
    }
  };
  const style = {
    position: 'fixed', top: '20px', left: '50%', transform: 'translateX(-50%)',
    padding: '1rem 2rem', borderRadius: '8px',
    background: backgroundStyle(),
    color: 'white', fontWeight: 600, boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
    zIndex: 1000, fontSize: '0.9rem',
  };
  return <div style={style}>{message}</div>;
};

// --- Componente Principal de la Página ---
function DashboardPage() {
  const { logout } = useAuth();
  const [stops, setStops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingStopId, setEditingStopId] = useState(null); 
  const [selectedStop, setSelectedStop] = useState(null);
  const [notification, setNotification] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [draftLocation, setDraftLocation] = useState(null); 

  // --- 2. ID de ruta dinámico (en lugar de hardcodeado) ---
  const { routeId } = useParams();

  // --- 3. Carga de datos (useEffect corregido) ---
  useEffect(() => {
    const fetchStops = async () => {
      // Usamos el 'routeId' de la URL
      if (!routeId) {
        setError('No se ha especificado un ID de ruta.');
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true); 
        setError(null);
        // Usamos la variable 'routeId'
        const response = await apiClient.get(`/routes/${routeId}/stops`);
        setStops(response.data);
      } catch (err) {
        console.error('Error al cargar las paradas:', err);
        setError('No se pudieron cargar las paradas. ¿El ID de la ruta es correcto?');
      } finally {
        setLoading(false);
      }
    };
    fetchStops();
  }, [routeId]); // Se re-ejecuta si el routeId (de la URL) cambia

  
  // --- Lógica de Handlers (sin cambios) ---

  const showNotification = (message, type = 'success', duration = 3000) => {
    setNotification({ message, type });
    setTimeout(() => { setNotification(null); }, duration);
  };

  const handleEditClick = (stop) => {
    if (editingStopId === stop.id) {
      setEditingStopId(null);
      setSelectedStop(stop);
    } else {
      setEditingStopId(stop.id);
      setSelectedStop(stop);
      showNotification("MODO EDICIÓN: Haz clic en el mapa para reubicar.", "info");
    }
  };

  const handleMapClick = (lat, lng) => {
    if (!editingStopId) return;
    setDraftLocation({ lat, lng });
    setModalOpen(true);
  };

  const handleModalCancel = () => {
    setModalOpen(false);
    setDraftLocation(null);
  };
  
  const handleModalConfirm = async () => {
    if (!draftLocation || !editingStopId) return;
    setModalOpen(false); 

    const payload = {
      gps_lat_cliente: draftLocation.lat,
      gps_lon_cliente: draftLocation.lng,
    };
    
    console.log(`--- DEBUG: Enviando PATCH a /stops/${editingStopId}/location ---`);
    console.log("Payload:", JSON.stringify(payload, null, 2));
    
    try {
      const response = await apiClient.patch(
        `/stops/${editingStopId}/location`, 
        payload
      );
      
      const updatedStop = response.data;
      setStops((currentStops) =>
        currentStops.map((stop) =>
          stop.id === editingStopId ? updatedStop : stop
        )
      );
      
      setSelectedStop(updatedStop);
      showNotification("¡Ubicación guardada con éxito!");

    } catch (err) {
      console.error('Error al actualizar la ubicación:', err);
      showNotification("Error al guardar la ubicación.", 'error');
    } finally {
      setEditingStopId(null); 
      setDraftLocation(null);
    }
  };

  const getModalContent = () => {
    if (!draftLocation || !editingStopId) return null;
    const stop = stops.find(s => s.id === editingStopId);
    if (!stop) return null;
    return (
      <pre style={{ fontFamily: 'monospace', fontSize: '0.9rem' }}>
        {`Parada: ${stop.customer_name}\n`}
        {`ID: ${stop.id.slice(-6)}...\n\n`}
        {`Nuevas Coordenadas:\n`}
        {`Lat: ${draftLocation.lat.toFixed(6)}\n`}
        {`Lon: ${draftLocation.lng.toFixed(6)}`}
      </pre>
    );
  };

  return (
    <div className="dashboard-page">
      <Notification 
        message={notification?.message} 
        type={notification?.type} 
      />
      
      <ConfirmModal
        isOpen={modalOpen}
        onCancel={handleModalCancel}
        onConfirm={handleModalConfirm}
        title="Confirmar Nueva Ubicación"
      >
        {getModalContent()}
      </ConfirmModal>
      
      {/* --- 4. Encabezado corregido --- */}
      <header className="dashboard-header">
        <Link to="/" className="back-link">
          &larr; Volver a Mis Rutas
        </Link>
        <button onClick={logout} className="logout-btn">
          Cerrar Sesión
        </button>
      </header>
      
      {loading && <p>Cargando paradas...</p>}
      {error && <p className="error-message">{error}</p>}

      {!loading && !error && (
        <div className="dashboard-content">
          <div className="stops-list-column">
            <h3>Paradas de la Ruta ({stops.length})</h3>
            {stops.length > 0 ? (
              stops.map((stop) => (
                <StopItem 
                  key={stop.id} stop={stop}
                  isEditing={editingStopId === stop.id}
                  onEditClick={() => handleEditClick(stop)}
                  onStopClick={() => setSelectedStop(stop)}
                  isSelected={selectedStop && selectedStop.id === stop.id}
                />
              ))
            ) : (
              <p>No hay paradas en esta ruta.</p>
            )}
          </div>
          
          <div className="map-column">
            <h3>Mapa de Paradas</h3>
            <MapComponent 
              stops={stops}
              selectedStop={selectedStop} 
              isEditing={editingStopId !== null} 
              onMapClick={handleMapClick}
            />
          </div>
        </div>
      )}
    </div>
  );
}

// 5. Estilo para el enlace "Volver"
const linkStyle = document.createElement('style');
linkStyle.innerHTML = `
  .back-link {
    font-size: 1rem; font-weight: 600; color: var(--primary-blue);
    text-decoration: none; transition: all 0.2s ease;
  }
  .back-link:hover { text-decoration: underline; opacity: 0.8; }
`;
document.head.appendChild(linkStyle);

export default DashboardPage;