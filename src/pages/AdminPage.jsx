// src/pages/AdminPage.jsx
import React, { useState } from 'react';
import apiClient from '../services/api';
import './AdminPage.css'; // Importamos el CSS

// --- Formulario 1: Crear Ruta (Componente) ---
function CreateRouteForm() {
  const [routeName, setRouteName] = useState('');
  const [routeStatus, setRouteStatus] = useState('PENDIENTE');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  const handleCreateRoute = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ text: '', type: '' });

    try {
      const response = await apiClient.post('/routes/', {
        name: routeName,
        status: routeStatus,
      });

      setMessage({
        text: `¡Ruta "${response.data.name}" creada con éxito! (ID: ${response.data.id})`,
        type: 'success',
      });
      setRouteName('');

    } catch (err) {
      console.error('Error al crear la ruta:', err);
      setMessage({
        text: 'Error al crear la ruta. ¿Estás logueado como admin?',
        type: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleCreateRoute} className="admin-form">
      <h3>Crear Nueva Ruta</h3>
      
      <div className="form-group">
        <label htmlFor="routeName">Nombre de la Ruta</label>
        <input 
          id="routeName" type="text"
          value={routeName}
          onChange={(e) => setRouteName(e.target.value)}
          placeholder="Ej: Ruta 201 - Norte"
          required
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="routeStatus">Estado</label>
        <input 
          id="routeStatus" type="text"
          value={routeStatus}
          onChange={(e) => setRouteStatus(e.target.value)}
          required
        />
      </div>

      <button type="submit" className="form-btn" disabled={isLoading}>
        {isLoading ? 'Creando...' : 'Crear Ruta'}
      </button>
      
      {message.text && (
        <p className={`form-message ${message.type}`}>
          {message.text}
        </p>
      )}
    </form>
  );
}

// --- Formulario 2: Añadir Parada (¡NUEVO!) ---
function AddStopForm() {
  // Estado inicial para todos los campos de la parada
  const initialStopState = {
    routeId: '',
    customer_name: '',
    order_in_route: 0,
    neighborhood_cliente: '',
    phone_cliente: '',
    gps_lat_cliente: 0,
    gps_lon_cliente: 0,
    address_street_cliente: '',
    address_number_cliente: '',
    address_ref1_cliente: '',
    address_ref2_cliente: '',
    correct_street: '',
    correct_number: '',
    correct_ref1: '',
    correct_ref2: '',
  };
  
  const [stopData, setStopData] = useState(initialStopState);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  // Manejador genérico para actualizar el estado
  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setStopData(prev => ({
      ...prev,
      // Convierte a número si es de tipo 'number'
      [name]: type === 'number' ? parseFloat(value) || 0 : value,
    }));
  };

  const handleAddStop = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ text: '', type: '' });

    // 1. Separar los datos para el JSON del body
    const { routeId, ...clientData } = stopData;
    
    // 2. Construir el payload exacto que espera la API
    const payload = {
      customer_name: clientData.customer_name,
      order_in_route: clientData.order_in_route,
      neighborhood_cliente: clientData.neighborhood_cliente,
      phone_cliente: clientData.phone_cliente,
      gps_lat_cliente: clientData.gps_lat_cliente,
      gps_lon_cliente: clientData.gps_lon_cliente,
      address_street_cliente: clientData.address_street_cliente,
      address_number_cliente: clientData.address_number_cliente,
      address_ref1_cliente: clientData.address_ref1_cliente,
      address_ref2_cliente: clientData.address_ref2_cliente,
      validation_data: {
        correct_street: clientData.correct_street,
        correct_number: clientData.correct_number,
        correct_ref1: clientData.correct_ref1,
        correct_ref2: clientData.correct_ref2,
      }
    };

    try {
      // 3. Llamar al endpoint anidado
      const response = await apiClient.post(
        `/routes/${stopData.routeId}/stops`, 
        payload
      );
      
      setMessage({
        text: `¡Parada "${response.data.customer_name}" añadida a la ruta!`,
        type: 'success',
      });
      // Limpiamos (excepto el ID de la ruta, para cargas rápidas)
      setStopData(prev => ({ ...initialStopState, routeId: prev.routeId }));

    } catch (err) {
      console.error('Error al añadir la parada:', err);
      const errorDetail = err.response?.data?.detail || 'Error desconocido.';
      setMessage({
        text: `Error al añadir parada: ${errorDetail}`,
        type: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleAddStop} className="admin-form">
      <h3>Añadir Parada a Ruta</h3>

      {/* --- Sección de Ruta --- */}
      <div className="form-group">
        <label htmlFor="routeId">ID de la Ruta (Obligatorio)</label>
        <input 
          id="routeId" name="routeId" type="text"
          value={stopData.routeId}
          onChange={handleChange}
          placeholder="Pega el ID de la ruta creada..."
          required
        />
      </div>

      <hr className="form-divider" />

      {/* --- Sección de Datos del Cliente --- */}
      <h4>Datos del Cliente (Lo "Sucio")</h4>
      <div className="form-grid">
        <div className="form-group">
          <label>Nombre Cliente</label>
          <input name="customer_name" type="text" value={stopData.customer_name} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Orden en Ruta</label>
          <input name="order_in_route" type="number" value={stopData.order_in_route} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Teléfono</label>
          <input name="phone_cliente" type="text" value={stopData.phone_cliente} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Barrio (Cliente)</label>
          <input name="neighborhood_cliente" type="text" value={stopData.neighborhood_cliente} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Calle (Cliente)</label>
          <input name="address_street_cliente" type="text" value={stopData.address_street_cliente} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Número (Cliente)</label>
          <input name="address_number_cliente" type="text" value={stopData.address_number_cliente} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Entre Calle 1</label>
          <input name="address_ref1_cliente" type="text" value={stopData.address_ref1_cliente} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Entre Calle 2</label>
          <input name="address_ref2_cliente" type="text" value={stopData.address_ref2_cliente} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>GPS Latitud (Simulación)</label>
          <input name="gps_lat_cliente" type="number" step="any" value={stopData.gps_lat_cliente} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>GPS Longitud (Simulación)</label>
          <input name="gps_lon_cliente" type="number" step="any" value={stopData.gps_lon_cliente} onChange={handleChange} />
        </div>
      </div>

      <hr className="form-divider" />
      
      {/* --- Sección de Datos de Validación --- */}
      <h4>Datos de Validación (La "Verdad" Manual)</h4>
      <div className="form-grid">
        <div className="form-group">
          <label>Calle Correcta</label>
          <input name="correct_street" type="text" value={stopData.correct_street} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Número Correcto</label>
          <input name="correct_number" type="text" value={stopData.correct_number} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Entre Calle 1 Correcta</label>
          <input name="correct_ref1" type="text" value={stopData.correct_ref1} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Entre Calle 2 Correcta</label>
          <input name="correct_ref2" type="text" value={stopData.correct_ref2} onChange={handleChange} />
        </div>
      </div>
      
      <button type="submit" className="form-btn" disabled={isLoading}>
        {isLoading ? 'Añadiendo...' : 'Añadir Parada'}
      </button>
      
      {message.text && (
        <p className={`form-message ${message.type}`}>
          {message.text}
        </p>
      )}
    </form>
  );
}


// --- Página Principal de Admin ---
function AdminPage() {
  return (
    <div className="admin-page">
      <h2 className="admin-header">Panel de Administrador</h2>
      
      {/* Formulario 1 */}
      <CreateRouteForm />
      
      {/* Formulario 2 */}
      <AddStopForm />

    </div>
  );
}

export default AdminPage;