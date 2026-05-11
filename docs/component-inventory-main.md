# Inventario de Componentes — app-ciudadano

> Generado: 2026-05-11 | Tipo: Mobile (Expo / React Native) | Escaneo: Rápido

## Resumen

| Categoría | Cantidad |
|---|---|
| Componentes de UI | 2 |
| Iconos SVG | 9 |
| Componentes de mapa | 1 |
| **Total** | **12** |

---

## Componentes UI (`src/components/`)

### Módulo Alertas (`src/components/alerts/`)

| Archivo | Descripción |
|---|---|
| `AlertsUi.tsx` | Componentes UI compartidos del módulo de alertas. Contiene elementos reutilizables entre pantallas del módulo (tarjetas, badges de severidad, listas de alertas, etc.) |

### Mapa (`src/components/map/`)

| Archivo | Descripción |
|---|---|
| `AlertMapView.tsx` | Vista de mapa interactiva usando MapLibre React Native. Muestra marcadores de alertas georreferenciadas con colores de severidad |

---

## Iconos SVG (`src/components/icons/`)

Exportados centralizadamente desde `src/components/icons/index.ts`.

| Componente | Propósito |
|---|---|
| `AlertasIcon` | Icono del módulo de alertas (navegación) |
| `AlertaMeteorologicaIcon` | Alerta de tipo meteorológico |
| `ActivaNotificacionesIcon` | Acción para activar notificaciones push |
| `GpsIcon` | Estado o acción relacionada a GPS / ubicación |
| `HistorialAlertasIcon` | Historial de alertas pasadas |
| `NivelesSeguridadIcon` | Guía de niveles de severidad |
| `NoticiasUltimaHoraIcon` | Últimas noticias de urgencia |
| `NotificacionesIcon` | Gestión de notificaciones push |
| `UltimasNoticiasIcon` | Feed de últimas noticias |

---

## Context Providers (Estado Global)

Aunque no son componentes visuales, actúan como wrappers en el árbol de React:

| Archivo | Hook expuesto | Responsabilidad |
|---|---|---|
| `src/context/AppConfigContext.tsx` | `useAppConfig()` | Branding, tema, URL API, config runtime |
| `src/context/NotificationContext.tsx` | `useNotification()` | Estado de permisos y notificaciones push (OneSignal) |

---

## Pantallas (`src/pages/`)

Las pantallas son componentes de nivel superior consumidos por las rutas. No son reutilizables directamente pero documentan los casos de uso:

### Módulo Alertas (`src/pages/alerts/`)

| Componente | Ruta asociada | Descripción |
|---|---|---|
| `AlertsLandingPage` | `/alertas` | Hub de acceso al módulo |
| `AlertHistoryPage` | `/alertas/historial` | Listado histórico de alertas |
| `IncidentAlertPage` | `/alertas/incidente` | Detalle de alerta de incidente activo |
| `SeverityLevelsPage` | `/alertas/niveles` | Guía educativa de niveles de severidad |
| `LatestNewsPage` | `/alertas/noticias` | Noticias de última hora desde API |
| `NotificationsPage` | `/alertas/notificaciones` | Preferencias y permisos de notificaciones |
| `NotificationsFeedPage` | `/alertas/notificaciones-feed` | Historial de notificaciones recibidas |

### Onboarding (`src/pages/onboarding/`)

| Componente | Descripción |
|---|---|
| `OnboardingPage` | Flujo inicial para nuevos usuarios: solicitud de permisos de ubicación y notificaciones |

---

## Patrones de Diseño Visual

### Sistema de Severidades

Los colores de severidad están definidos en `AppBaseConfig.json → modules.alerts`:

| Nivel | Color Light | Color Dark | Uso |
|---|---|---|---|
| `preventive` | `#F7C933` amarillo | `#F7C933` | Alertas de precaución |
| `emergency` | `#E01D24` rojo | `#E01D24` | Emergencias críticas |
| `informative` | `#188BD1` azul | `#188BD1` | Información general |

### Tipografía

Fuente Ubuntu cargada desde `assets/fonts/`:
- `Ubuntu-R.ttf` — Regular (body text)
- `Ubuntu-M.ttf` — Medium (subtítulos)
- `Ubuntu-B.ttf` — Bold (títulos y énfasis)

### Sistema de Estilos

NativeWind 4 (Tailwind CSS para React Native). Las clases Tailwind se usan directamente en los atributos `className` de los componentes React Native.

---

## Notas para Nuevos Componentes

1. Los iconos nuevos del dominio van en `src/components/icons/` y se exportan desde `index.ts`
2. Los componentes reutilizables de un módulo van en `src/components/<modulo>/`
3. Las pantallas van en `src/pages/<modulo>/` — no en `src/app/` directamente
4. Los estilos se aplican con clases NativeWind (`className="..."`) — no con `StyleSheet.create()`
