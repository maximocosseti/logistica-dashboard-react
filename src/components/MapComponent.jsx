// src/components/MapComponent.jsx
import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import './MapComponent.css';

const LA_PLATA_CENTER = [-34.9214, -57.9545];

// --- Componente de Efecto de Vuelo ---
function MapEffect({ selectedStop, stopRefs }) {
  const map = useMap();
  useEffect(() => {
    if (selectedStop) {
      map.flyTo(
        [selectedStop.gps_lat_cliente, selectedStop.gps_lon_cliente],
        15
      );
      
      const timer = setTimeout(() => {
        if (stopRefs.current && stopRefs.current[selectedStop.id]) {
          const marker = stopRefs.current[selectedStop.id];
          marker.openPopup();
        }
      }, 100); 
      
      return () => clearTimeout(timer);
    }
  }, [selectedStop, map, stopRefs]);
  return null;
}

// --- Componente de Clic de Mapa ---
function MapClickHandler({ isEditing, onMapClick }) {
  const map = useMap();
  
  // Cambia el cursor
  useEffect(() => {
    if (isEditing) {
      map.getContainer().style.cursor = 'crosshair';
    } else {
      map.getContainer().style.cursor = 'grab';
    }
  }, [isEditing, map]);

  // Escucha los clics
  useMapEvents({
    click(e) {
      if (isEditing) {
        onMapClick(e.latlng.lat, e.latlng.lng);
      }
    },
  });
  return null;
}

// --- NUEVO: Componente Marcador (para arreglar el bug) ---
// Separamos el Marker para que tenga su propio ciclo de vida
function StopMarker({ stop, addRef }) {
  const markerRef = useRef(null);
  const position = [stop.gps_lat_cliente, stop.gps_lon_cliente];

  // --- ¡ESTA ES LA SOLUCIÓN AL "PIN FANTASMA"! ---
  // Este hook vigila si la posición de la parada (en el estado de React)
  // ha cambiado, y fuerza al pin de Leaflet a moverse.
  useEffect(() => {
    if (markerRef.current) {
      markerRef.current.setLatLng(position);
    }
  }, [position]); // Se re-ejecuta si la 'position' (lat/lon) cambia
  
  // Registra la ref en el padre
  useEffect(() => {
    if (markerRef.current) {
      addRef(stop.id, markerRef.current);
    }
  }, [stop.id, addRef]);
  
  return (
    <Marker 
      position={position}
      ref={markerRef}
    >
      <Popup>
        <strong>Cliente:</strong> {stop.customer_name}<br />
        <strong>Estado:</strong> {stop.validation_status}<br />
        <small>(Haz clic en 'Editar' en la lista para mover)</small>
      </Popup>
    </Marker>
  );
}

// --- Componente Principal del Mapa (Corregido) ---
function MapComponent({ stops, selectedStop, isEditing, onMapClick }) {
  
  const stopRefs = useRef({});
  stopRefs.current = {}; 

  const addRef = (id, ref) => {
    if (ref) {
      stopRefs.current[id] = ref;
    } else {
      delete stopRefs.current[id];
    }
  };

  return (
    <div className="map-card">
      <MapContainer 
        center={LA_PLATA_CENTER} 
        zoom={11} 
        className="leaflet-container"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Usamos el nuevo componente 'StopMarker' */}
        {stops.map((stop) => (
          <StopMarker 
            key={stop.id}
            stop={stop} 
            addRef={addRef} 
          />
        ))}
        
        <MapEffect selectedStop={selectedStop} stopRefs={stopRefs} />
        
        <MapClickHandler 
          isEditing={isEditing} 
          onMapClick={onMapClick} 
        />
        
      </MapContainer>
    </div>
  );
}

export default MapComponent;