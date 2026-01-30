# KDS Frontend – Next.js

## 1. Descripción de la solución

Este proyecto implementa el frontend de un **Kitchen Display System (KDS)**, encargado de visualizar en tiempo real las órdenes activas y permitir la interacción del personal de cocina.

La aplicación está desarrollada con **Next.js** y está diseñada para:
- Mostrar pedidos activos.
- Reflejar cambios de estado de las órdenes.
- Mantener una estructura escalable y fácil de mantener.

Se priorizó la claridad del flujo de datos y la separación de responsabilidades sobre la complejidad visual.

---

## 2. Instrucciones para ejecutar el proyecto

### Requisitos previos
- Node.js (v18 o superior)
- npm

### Instalación

1. Instalar dependencias:
```bash
npm install
```

2. Crear el archivo .env.local en la raíz del proyecto:
```bash
# Environment Variables for Local Development
NEXT_PUBLIC_API_URL_BASE = 'http://localhost'
NEXT_PUBLIC_API_PORT = '3001'
NEXT_PUBLIC_WARNING_DELAY = '1'  # in minutes
NEXT_PUBLIC_DANGER_DELAY = '2'  # in minutes
NEXT_PUBLIC_API_KEY = '3uibNAk5CvDHuoL'

# Order Service Endpoints
NEXT_PUBLIC_API_ORDERSERVICE_BASE = '/orders'
NEXT_PUBLIC_API_URL_GETACTIVEORDERS = '/active'
NEXT_PUBLIC_API_URL_MOVEINPROGRESS = '/in-progress'
NEXT_PUBLIC_API_URL_MOVEREADY = '/ready'
NEXT_PUBLIC_API_URL_MOVEDELIVERED = '/delivered'
NEXT_PUBLIC_API_URL_UPDATEORDER = '/updateorder'
NEXT_PUBLIC_API_URL_CANCELORDER = '/cancelled'

# Rider Service Endpoints
NEXT_PUBLIC_API_RIDERSERVICE_BASE = '/riders'
```
Este archivo es obligatorio, ya que define:
- La URL del backend.
- La API Key necesaria para comunicarse con el servidor.

3. Ejecutar el proyecto:
```bash
npm run dev
```

la aplicación estara disponible en:
```bash
http://localhost:3000
```

## 3. Decisiones técnicas relevantes

### Arquitectura basada en features + hooks

El frontend sigue una arquitectura feature-based, donde cada funcionalidad agrupa:
- Componentes de UI
- Hooks de lógica
- Servicios de acceso a datos

Separación de responsabilidades:

- Servicios: comunicación con el API.
- Hooks: lógica de estado y transformación de datos.
- Componentes: presentación visual.

Esto permite:
- Componentes más simples y reutilizables.
- Lógica desacoplada de la UI.
- Escalabilidad a medida que el proyecto crece.

### Polling para sincronización de pedidos

En un entorno productivo, el frontend recibiría actualizaciones en tiempo real mediante WebSockets o Server-Sent Events. El frontend utiliza polling periódico para consultar nuevas órdenes activas, mantener sincronización con el estado del backend y simular el comportamiento que tendría un sistema con webhooks o eventos en tiempo real.

Esta decisión mantiene el flujo realista sin introducir infraestructura adicional fuera del alcance del desafío.

### Manejo del negocio en el frontend

El frontend no implementa reglas de negocio críticas. Su responsabilidad se limita a mostrar información, aplicar lógica de presentación (formatos de fecha, colores, estados visuales) y delegar validaciones y decisiones importantes al backend.

Esto refuerza la consistencia del sistema y evita duplicar reglas.

## 4. Posibles mejoras

- Reemplazar polling por WebSockets.
- Manejo de estados globales más complejo si el sistema crece.
- Tests de componentes y hooks.
- Mejoras visuales y de UX.
- Opcion de agregar botones con mas opcion en el menu de cada orden.
- Agregar accion de eliminar items de la orden (Aplicado solo UI en el esto de "En preparación").
- Manejo de errores y estados de carga más detallados.
