# Análisis del Árbol de Fuentes — app-ciudadano

> Generado: 2026-05-11 | Escaneo: Rápido | Tipo: Mobile (Expo / React Native)

## Árbol de Directorios Anotado

```
app-ciudadano/
├── src/                          # Código fuente principal
│   ├── app/                      # Rutas Expo Router (file-based routing)
│   │   ├── _layout.tsx           # Layout raíz — providers, splash, tema
│   │   └── alertas/              # Módulo de alertas (rutas)
│   │       ├── _layout.tsx       # Layout del módulo alertas
│   │       ├── index.tsx         # Pantalla principal de alertas → AlertsLandingPage
│   │       ├── historial.tsx     # Historial de alertas → AlertHistoryPage
│   │       ├── incidente.tsx     # Alerta de incidente → IncidentAlertPage
│   │       ├── niveles.tsx       # Niveles de severidad → SeverityLevelsPage
│   │       ├── noticias.tsx      # Últimas noticias → LatestNewsPage
│   │       ├── notificaciones.tsx          # Configuración notificaciones → NotificationsPage
│   │       └── notificaciones-feed.tsx     # Feed de notificaciones → NotificationsFeedPage
│   │
│   ├── pages/                    # Pantallas por dominio (separación ruta/UI)
│   │   ├── alerts/               # Pantallas del módulo de alertas
│   │   │   ├── AlertsLandingPage.tsx       # Página de inicio del módulo alertas
│   │   │   ├── AlertHistoryPage.tsx        # Historial de alertas pasadas
│   │   │   ├── IncidentAlertPage.tsx       # Detalle de alerta de incidente
│   │   │   ├── LatestNewsPage.tsx          # Últimas noticias
│   │   │   ├── NotificationsFeedPage.tsx   # Feed en tiempo real de notificaciones
│   │   │   ├── NotificationsPage.tsx       # Gestión de preferencias de notificación
│   │   │   └── SeverityLevelsPage.tsx      # Guía de niveles de severidad
│   │   └── onboarding/
│   │       └── OnboardingPage.tsx          # Flujo de bienvenida / permisos iniciales
│   │
│   ├── components/               # UI reutilizable
│   │   ├── alerts/
│   │   │   └── AlertsUi.tsx      # Componentes UI compartidos del módulo alertas
│   │   ├── icons/                # Iconos SVG del dominio
│   │   │   ├── index.ts          # Barrel export de todos los iconos
│   │   │   ├── AlertasIcon.tsx
│   │   │   ├── AlertaMeteorologicaIcon.tsx
│   │   │   ├── ActivaNotificacionesIcon.tsx
│   │   │   ├── GpsIcon.tsx
│   │   │   ├── HistorialAlertasIcon.tsx
│   │   │   ├── NivelesSeguridadIcon.tsx
│   │   │   ├── NoticiasUltimaHoraIcon.tsx
│   │   │   ├── NotificacionesIcon.tsx
│   │   │   └── UltimasNoticiasIcon.tsx
│   │   └── map/
│   │       └── AlertMapView.tsx  # Mapa de alertas (MapLibre)
│   │
│   ├── services/                 # Capa de acceso a datos
│   │   ├── core/
│   │   │   └── ApiClient.ts      # Cliente HTTP base (configurable por .env)
│   │   ├── alerts/
│   │   │   └── AlertService.ts   # Servicio de alertas y noticias
│   │   └── users/
│   │       └── UserService.ts    # Servicio de usuarios / autenticación
│   │
│   ├── context/                  # Estado global (React Context API)
│   │   ├── AppConfigContext.tsx  # Config de branding, tema y API — useAppConfig()
│   │   └── NotificationContext.tsx # Estado de notificaciones push — useNotification()
│   │
│   ├── hooks/
│   │   └── usePermissionSync.ts  # Sincroniza permisos del dispositivo con backend
│   │
│   ├── config/
│   │   ├── AppBaseConfig.json    # Fuente de verdad: branding, tema, assets, módulos
│   │   └── AppBaseConfig.ts      # Bridge runtime: carga JSON + variables de entorno
│   │
│   ├── types/
│   │   └── AppConfig.ts          # Tipos TypeScript del sistema de configuración
│   │
│   ├── utils/
│   │   └── Responsive.ts         # Helpers de dimensiones responsivas
│   │
│   └── global.css                # Estilos globales NativeWind / Tailwind
│
├── assets/                       # Recursos estáticos de la app
│   ├── fonts/                    # Tipografía Ubuntu (R, M, B)
│   └── images/                   # Iconos, splash, logos, íconos de tabs
│
├── android/                      # Proyecto nativo Android (generado por prebuild)
│   └── app/                      # Módulo de la app Android
│
├── plugins/
│   └── WithFollyHeaderPathFix.js # Plugin Expo: fix de headers RCT-Folly post-prebuild
│
├── scripts/
│   └── reset-project.js          # Script para resetear el proyecto a estado base
│
├── app.config.js                 # Config nativa Expo — lee AppBaseConfig.json
├── tailwind.config.js            # Configuración Tailwind / NativeWind
├── metro.config.js               # Configuración de Metro bundler
├── babel.config.js               # Configuración de Babel
├── tsconfig.json                 # Configuración TypeScript
├── package.json                  # Dependencias y scripts npm
├── .env                          # Variables de entorno (no commitear)
├── .env.example                  # Plantilla de variables de entorno
├── README.md                     # Guía de inicio rápido y troubleshooting
└── ARCHITECTURE.md               # Guía de arquitectura y convenciones
```

## Puntos de Entrada

| Punto de entrada | Ruta | Descripción |
|---|---|---|
| Main (Expo Router) | `expo-router/entry` → `src/app/_layout.tsx` | Bootstraps providers y carga config |
| Pantalla inicial | `src/app/index.tsx` | Redirección según estado del usuario |
| Módulo Alertas | `src/app/alertas/index.tsx` | Landing del módulo principal |

## Directorios Críticos

| Directorio | Propósito |
|---|---|
| `src/app/` | Rutas del router — cada archivo es una URL de navegación |
| `src/pages/` | Lógica de pantallas separada de las rutas |
| `src/services/` | Toda comunicación con el backend |
| `src/context/` | Estado global compartido entre pantallas |
| `src/config/` | Configuración de branding y tema |
| `android/` | Código nativo Android (no editar manualmente) |

## Patrones de Integración

- `src/app/` → importa de `src/pages/` (separación ruta/UI)
- `src/pages/` → importa de `src/services/` y `src/components/`
- `src/services/` → usa `ApiClient.ts` como HTTP base
- `src/config/AppBaseConfig.ts` → leído por `AppConfigContext.tsx`
- `app.config.js` → lee `AppBaseConfig.json` para configuración nativa
