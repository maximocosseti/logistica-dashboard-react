#  Dashboard de Validación Logística (React & Vite)

Este repositorio contiene el **frontend (Dashboard)** del proyecto de Validación Logística. Es una Aplicación de Página Única (SPA) construida con React, diseñada para consumir la API de FastAPI y proveer una interfaz de usuario limpia para los repartidores y administradores.

La interfaz permite a los repartidores visualizar sus paradas asignadas en una lista (con un semáforo de colores) y en un mapa interactivo (Leaflet), identificando rápidamente paradas problemáticas (marcadas en ROJO o AMARILLO).

La característica principal es el **"bucle de retroalimentación"**, que permite al repartidor entrar en un "modo de edición" para corregir la ubicación GPS de una parada directamente haciendo clic en el mapa.

---

## 📋 Características Principales

* **Framework Moderno:** Construido con **Vite** para un desarrollo ultra-rápido.
* **Enrutamiento (Routing):** Usa `react-router-dom` para manejar las vistas de la aplicación.
* **Gestión de Estado Global:** `React Context` para manejar la autenticación (token y datos del usuario) en toda la app.
* **Rutas Protegidas:**
    * `ProtectedRoute`: Protege el dashboard (`/`) y redirige a `/login` si no hay token.
    * `AdminRoute`: Protege (`/admin`) y redirige si el usuario no tiene el rol de `admin`.
* **Interfaz de Mapa Interactiva:**
    * Renderiza paradas en un mapa real usando **React-Leaflet**.
    * Permite hacer clic en la lista para volar (`flyTo`) al pin correspondiente.
    * **Modo Edición (Click-to-Update):** Permite reubicar una parada haciendo clic en el mapa, que llama al endpoint `PATCH` del backend.
* **Lógica de UI:**
    * Renderiza las paradas con un código de colores (Rojo/Amarillo/Verde) basado en el `validation_status` de la API.
    * Muestra notificaciones y modales de confirmación para una mejor UX.
* **Consumo de API:** Usa `axios` con *interceptors* para adjuntar automáticamente el token JWT a todas las peticiones protegidas.

---

## 💻 Stack Tecnológico

* **React 18** (con Vite)
* **React Router v6** (para enrutamiento)
* **React Context** (para gestión de estado)
* **Axios** (para peticiones a la API)
* **React-Leaflet** & **Leaflet** (para el mapa)
* **CSS Moderno** (Flexbox, Grid, y variables CSS)

---

## 📦 Instalación y Ejecución

1.  **Requisito Previo:** Asegúrate de que el [Backend API](https://github.com/maximocosseti/proyecto-logistica) esté instalado y corriendo en `http://127.0.0.1:8000`.

2.  **Clonar el repositorio:**
    ```bash
    # (Asegúrate de poner la URL de tu repo frontend)
    git clone [https://github.com/tu-usuario/logistica-dashboard-react.git](https://github.com/tu-usuario/logistica-dashboard-react.git)
    cd logistica-dashboard-react
    ```

3.  **Instalar dependencias:**
    ```bash
    npm install
    ```

4.  **Ejecutar el servidor de desarrollo:**
    ```bash
    npm run dev
    ```
    * El frontend estará disponible en `http://localhost:5173` (o el puerto que indique Vite).