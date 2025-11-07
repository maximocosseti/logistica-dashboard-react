// src/components/StopItem.jsx
import React from 'react';
import './StopItem.css';

const StopItem = ({ 
  stop, 
  onStopClick, 
  isSelected, 
  isEditing, 
  onEditClick, 
}) => {

  const selectedClass = isSelected ? 'selected' : '';
  // Si esta parada es la que se está editando, le damos un estilo extra
  const editingClass = isEditing ? 'is-editing' : '';

  const handleCardClick = () => {
    onStopClick(stop);
  };
  
  // El clic en el botón SÍ entra/sale del modo edición
  const handleEditButton = (e) => {
    e.stopPropagation(); // Evita que el clic se propague a la tarjeta
    onEditClick(stop);
  };

  return (
    <div 
      className={`stop-item ${selectedClass} ${editingClass}`}
      data-status={stop.validation_status}
      onClick={handleCardClick}
      style={{ cursor: 'pointer' }}
    >
      <div className="stop-item-content">
        <h4 data-status={stop.validation_status}>
          Parada: {stop.customer_name}
        </h4>
        <p><strong data-status={stop.validation_status}>Estado:</strong> {stop.validation_status}</p>
        <p><strong>Mensaje:</strong> {stop.validation_message}</p>
        <p><strong>Barrio (Cliente):</strong> {stop.neighborhood_cliente}</p>
        <p><strong>Calle (Cliente):</strong> {stop.address_street_cliente}</p>
      </div>

      <div className="stop-item-actions">
        {/* Mostramos "Editando" o "Editar Posición" */}
        <button 
          onClick={handleEditButton} 
          className={isEditing ? 'cancel-btn' : 'edit-btn'} // Cambia el color
        >
          {isEditing ? 'Cancelar Edición' : 'Editar Posición'}
        </button>
      </div>
    </div>
  );
};

export default StopItem;