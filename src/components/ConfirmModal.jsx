// src/components/ConfirmModal.jsx
import React from 'react';
import './ConfirmModal.css'; // Crearemos este archivo ahora

function ConfirmModal({ isOpen, onCancel, onConfirm, title, children }) {
  // Si no está abierto, no renderiza nada
  if (!isOpen) {
    return null;
  }

  return (
    // El fondo oscuro semitransparente
    <div className="modal-overlay" onClick={onCancel}>
      {/* El contenedor de la tarjeta (evita que se cierre al hacer clic adentro) */}
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <h3>{title}</h3>
        <div className="modal-content">
          {children}
        </div>
        <div className="modal-actions">
          <button onClick={onCancel} className="modal-btn-cancel">
            Cancelar
          </button>
          <button onClick={onConfirm} className="modal-btn-confirm">
            Aceptar
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;