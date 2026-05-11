# Arquitectura — app-ciudadano

> Generado: 2026-05-11 | Tipo: Mobile (Expo / React Native) | Escaneo: Rápido

## Resumen Ejecutivo

**app-ciudadano** es una aplicación móvil Expo con arquitectura en capas orientada a la separación de responsabilidades. Usa file-based routing (expo-router), un sistema de configuración centralizado en JSON y dos context providers como estado global. El proyecto está diseñado para ser fácilmente configurable sin modificar código fuente.

---

## Stack Tecnológico

| Categoría | Tecnología | Versión |
|---|---|---|
| Framework | Expo SDK | ~55.0.5 |
| Runtime | React Native | 0.83.2 |
| Lenguaje | TypeScript | ~5.9.2 |
| Navegación | expo-router | ~55.0.4 |
| Estilos | NativeWind 4 + Tailwind CSS 3 | ^4.2.2 / ^3.4.19 |
| Mapas | MapLibre React Native | ^11.0.1 |
| Push notifications | OneSignal (expo plugin) | ^5.4.3 |
| Almacenamiento local | AsyncStorage | ^1.23.1 |
| Animaciones | react-native-reanimated | 4.2.1 |
| Location | expo-location | ^55.1.8 |

---

## Patrón Arquitectónico

### Arquitectura en Capas (Layered Architecture)

```
┌─────────────────────────────────────────┐
│           CAPA DE RUTAS                 │
│  src/app/  (expo-router file-based)     │
│  Define URLs de navegación              │
└──────────────────┬──────────────────────┘
                   │ importa
┌──────────────────▼──────────────────────┐
│           CAPA DE PANTALLAS             │
│  src/pages/  (Page Components)          │
│  Lógica de UI, estados locales          │
└──────────────────┬──────────────────────┘
                   │ importa
┌──────────────────▼──────────────────────┐
│         CAPA DE SERVICIOS               │
│  src/services/  (Service Layer)         │
│  Comunicación HTTP con el backend       │
└──────────────────┬──────────────────────┘
                   │ usa
┌──────────────────▼──────────────────────┐
│         CLIENTE HTTP BASE               │
│  src/services/core/ApiClient.ts         │
│  URL configurable por .env              │
└─────────────────────────────────────────┘
```

### Estado Global (React Context API)

```
AppConfigContext (src/context/AppConfigContext.tsx)
  └── Provee: config de branding, tema, URL API
  └── Hook: useAppConfig()
  └── Fuente: AppBaseConfig.json + .env

NotificationContext (src/context/NotificationContext.tsx)
  └── Provee: estado de notificaciones push, permisos
  └── Hook: useNotification()
  └── Integra: OneSignal
```

---

## Sistema de Configuración

El sistema de configuración es una característica central del proyecto:

```
AppBaseConfig.json          ← Fuente de verdad editable (branding, tema, assets)
       ↓
AppBaseConfig.ts            ← Bridge de runtime (carga JSON + .env)
       ↓
AppConfigContext.tsx         ← Expone config al árbol de componentes
       ↓
app.config.js               ← Aplica config a build nativo (iOS/Android/Web)
```

**Lo que es configurable sin tocar código:**
- Nombre, slug, scheme, bundle IDs
- Colores de tema (light y dark)
- Logo (ninguno / local / remoto)
- Íconos y splash screen
- URL base del backend API

---

## Estructura de Módulos

### Módulo de Alertas

El único módulo funcional implementado. Organizado verticalmente:

```
src/app/alertas/          ← Rutas (URLs de navegación)
src/pages/alerts/         ← Pantallas (lógica UI)
src/services/alerts/      ← Acceso a datos (AlertService.ts)
src/components/alerts/    ← Componentes UI reutilizables
src/components/icons/     ← Iconos SVG del módulo
src/components/map/       ← Mapa de alertas (MapLibre)
```

**Pantallas del módulo:**
1. `AlertsLandingPage` — Hub principal
2. `AlertHistoryPage` — Historial cronológico
3. `IncidentAlertPage` — Detalle de alerta activa
4. `SeverityLevelsPage` — Guía de niveles (preventivo / emergencia / informativo)
5. `LatestNewsPage` — Noticias de última hora
6. `NotificationsPage` — Gestión de permisos y preferencias
7. `NotificationsFeedPage` — Feed de notificaciones recibidas

---

## Flujo de Datos

```
Backend API (Railway)
    ↓ HTTP
ApiClient.ts (src/services/core/)
    ↓
AlertService.ts / UserService.ts
    ↓
Page Components (src/pages/)
    ↓
Route Components (src/app/)
    ↕
AppConfigContext / NotificationContext
```

---

## Diseño Visual

**Sistema de severidades de alerta:**

| Nivel | Color (Light) | Uso |
|---|---|---|
| Preventiva | `#F7C933` (amarillo) | Alertas de precaución |
| Emergencia | `#E01D24` (rojo) | Alertas críticas |
| Informativa | `#188BD1` (azul) | Información general |

**Tema:** Sistema de colores dual (light/dark) definido en `AppBaseConfig.json`, con paleta marrón/tierra como primaria.

---

## Navegación

- **Motor:** expo-router (file-based routing)
- **Plataforma iOS:** Native tabs con `unstable-native-tabs` (estilo Liquid Glass)
- **Plataforma Android/Web:** Bottom tabs clásicos
- **Patrón deep link:** `appciudadano://`

---

## Gestión de Permisos

Hook `usePermissionSync.ts` — sincroniza los permisos del dispositivo (ubicación, notificaciones) con el backend. Garantiza que el backend sepa qué permisos tiene el usuario.

Permisos requeridos:
- **Ubicación** (`expo-location`): para alertas relevantes a la zona del usuario
- **Notificaciones push** (OneSignal): para recibir alertas en tiempo real

---

## Despliegue y Build

| Modo | Descripción |
|---|---|
| Desarrollo | `expo start` — Metro bundler con hot reload |
| Android nativo | `expo run:android` o `./gradlew assembleDebug` |
| iOS nativo | `expo run:ios` (requiere macOS + Xcode) |
| Prebuild | `expo prebuild --clean` — regenera `android/` e `ios/` |
| Web | `expo start --web` — output estático |

**Plugin de build:** `WithFollyHeaderPathFix.js` corrige automáticamente los headers de `RCT-Folly` después de cada prebuild (workaround de compatibilidad con Hermes).

---

## Pruebas

No se encontraron archivos de prueba (`*.test.ts`, `*.spec.ts`) en el escaneo rápido. La suite de testing no está configurada aún.

---

## Documentación de Referencia

- [README.md](../README.md) — Configuración, ejecución y troubleshooting
- [ARCHITECTURE.md](../ARCHITECTURE.md) — Convenciones y guía de contribución
- [Árbol de fuentes](./source-tree-analysis.md)
- [Guía de desarrollo](./development-guide-main.md)
- [API y servicios](./api-contracts-main.md)
