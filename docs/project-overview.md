# Visión General del Proyecto — app-ciudadano

> Generado: 2026-05-11 | Escaneo: Rápido

## Resumen Ejecutivo

**app-ciudadano** (nombre comercial: *Ciudadano*) es una aplicación móvil multiplataforma para ciudadanos que centraliza alertas de emergencia, notificaciones de incidentes, noticias de última hora y mapas de situación en tiempo real.

La app está diseñada como una **base configurable por entorno**: el branding, los colores, los íconos y la URL del backend se configuran sin cambiar código fuente. Esto permite reutilizarla como plantilla para distintas instancias o municipios.

## Stack Tecnológico

| Categoría | Tecnología | Versión |
|---|---|---|
| Framework | Expo | ~55.0.5 |
| Runtime móvil | React Native | 0.83.2 |
| Lenguaje | TypeScript | ~5.9.2 |
| Navegación | expo-router | ~55.0.4 |
| Estilos | NativeWind (Tailwind CSS) | ^4.2.2 |
| Mapas | @maplibre/maplibre-react-native | ^11.0.1 |
| Notificaciones push | react-native-onesignal | ^5.4.3 |
| Almacenamiento local | AsyncStorage | ^1.23.1 |
| Animaciones | react-native-reanimated | 4.2.1 |
| Gestos | react-native-gesture-handler | ~2.30.0 |
| Imágenes | expo-image | ~55.0.6 |
| Ubicación | expo-location | ^55.1.8 |
| Toast/feedback | react-native-toast-message | ^2.3.3 |

## Plataformas Soportadas

| Plataforma | Estado |
|---|---|
| Android | Soportado (nativo via prebuild) |
| iOS | Soportado (nativo via prebuild) |
| Web | Soportado (output estático) |

## Tipo de Arquitectura

- **Repositorio:** Monolito (un único proyecto Expo)
- **Patrón de navegación:** File-based routing (expo-router)
- **Separación de responsabilidades:** Rutas (`app/`) → Pantallas (`pages/`) → Servicios (`services/`)
- **Estado global:** React Context API (dos providers: configuración y notificaciones)
- **Configuración:** JSON + variables de entorno (sin hardcoding en componentes)

## Módulos Funcionales

### Alertas (`src/app/alertas/`)

El módulo principal de la app. Contiene:

| Pantalla | Descripción |
|---|---|
| Landing de alertas | Hub de acceso a todas las funciones del módulo |
| Historial de alertas | Alertas pasadas ordenadas cronológicamente |
| Alerta de incidente | Detalle de una alerta de emergencia activa |
| Niveles de severidad | Guía de colores y categorías: preventiva, emergencia, informativa |
| Últimas noticias | Noticias de última hora consumidas desde la API |
| Notificaciones | Gestión de preferencias y permisos de notificación push |
| Feed de notificaciones | Historial de notificaciones recibidas |

### Onboarding (`src/pages/onboarding/`)

Flujo inicial de bienvenida. Gestiona la solicitud de permisos del dispositivo (ubicación, notificaciones).

## Variables de Entorno

| Variable | Requerida | Descripción |
|---|---|---|
| `EXPO_PUBLIC_API_BASE_URL` | Sí | URL base del backend de alertas |
| `EXPO_PUBLIC_ONESIGNAL_APP_ID` | Sí | App ID de OneSignal para push notifications |

**Backend en producción:** `https://app-alertamientos-production.up.railway.app/api`

## Identificadores de la App

| Campo | Valor |
|---|---|
| Bundle ID (iOS) | `com.sg.ciudadano` |
| Package (Android) | `com.sg.ciudadano` |
| Scheme deep link | `appciudadano://` |
| Versión | 1.0.0 |

## Documentación Relacionada

- [Árbol de fuentes](./source-tree-analysis.md)
- [Arquitectura](./architecture-main.md)
- [Guía de desarrollo](./development-guide-main.md)
- [API y servicios](./api-contracts-main.md)
- [Inventario de componentes](./component-inventory-main.md)
- [Modelos de datos](./data-models-main.md)
- [Inventario de assets](./asset-inventory-main.md)
