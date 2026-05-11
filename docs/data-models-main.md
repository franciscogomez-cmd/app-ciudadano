# Modelos de Datos — app-ciudadano

> Generado: 2026-05-11 | Tipo: Mobile (Expo / React Native) | Escaneo: Rápido

> **Nota:** Documento generado en modo escaneo rápido. Los tipos exactos de DTOs y modelos de dominio requieren un escaneo profundo para documentación completa.

## Arquitectura de Datos

Esta app es un **cliente móvil** — no tiene base de datos propia. Los datos provienen de:

1. **Backend API** — alertas, noticias, usuarios (HTTP)
2. **AsyncStorage** — estado persistente local del usuario
3. **AppBaseConfig.json** — configuración de branding y tema
4. **Context de React** — estado en memoria durante la sesión

## Tipos TypeScript Detectados

### Sistema de Configuración (`src/types/AppConfig.ts`)

Tipos del sistema de configuración central. Define la forma de `AppBaseConfig.json`:

Estructura inferida de `AppBaseConfig.json`:

```typescript
// Estructura de alto nivel (inferida del JSON)
interface AppBaseConfig {
  metadata: AppMetadata;
  branding: AppBranding;
  theme: AppTheme;
  navigationTabs: NavigationTabsConfig;
  assets: AppAssets;
  apiDefaults: ApiDefaults;
  modules: {
    alerts: AlertsModuleConfig;
  };
}

interface AppMetadata {
  name: string;
  slug: string;
  scheme: string;
  androidPackage: string;
  iosBundleIdentifier: string;
  version: string;
  orientation: 'portrait' | 'landscape';
}

interface AppTheme {
  colorMode: 'light' | 'dark' | 'system';
  light: ThemeColors;
  dark: ThemeColors;
}

interface ThemeColors {
  primary: string;
  secondary: string;
  background: string;
  surface: string;
  text: string;
  textMuted: string;
  border: string;
  buttonText: string;
  statusBarStyle: 'light' | 'dark';
}
```

### Módulo de Alertas (`src/services/alerts/AlertService.ts`)

Tipos de dominio inferidos de las pantallas disponibles:

```typescript
// Tipos inferidos (verificar en código fuente)
type AlertSeverity = 'preventive' | 'emergency' | 'informative';

interface Alert {
  id: string;
  title: string;
  description: string;
  severity: AlertSeverity;
  location?: GeoCoordinate;
  createdAt: string;
  // ... campos adicionales por confirmar
}

interface NewsItem {
  id: string;
  title: string;
  content: string;
  publishedAt: string;
  // ... campos adicionales por confirmar
}

interface GeoCoordinate {
  latitude: number;
  longitude: number;
}
```

### Usuario (`src/services/users/UserService.ts`)

```typescript
// Tipos inferidos (verificar en código fuente)
interface User {
  id: string;
  // ... campos por confirmar desde UserService.ts
}
```

## Almacenamiento Local (AsyncStorage)

El proyecto usa `@react-native-async-storage/async-storage` para persistencia local.

Basado en el comportamiento detectado (commit `a97af07`):

| Clave (inferida) | Tipo | Descripción |
|---|---|---|
| Estado de usuario | Object | Datos del usuario autenticado |
| Estado de onboarding | Boolean | Si el usuario completó el onboarding |
| Preferencias de notificación | Object | Configuración de permisos push |

> Las claves exactas de AsyncStorage requieren lectura del código fuente.

## Niveles de Severidad (Dominio)

Definidos en `AppBaseConfig.json → modules.alerts`:

| Nivel | Código | Color (light) | Uso |
|---|---|---|---|
| Preventiva | `preventive` | `#F7C933` | Precaución, preparación |
| Emergencia | `emergency` | `#E01D24` | Emergencia activa, acción inmediata |
| Informativa | `informative` | `#188BD1` | Información general |

## Escaneo Profundo

Para tipos completos con todos los campos, ejecutar `/bmad-document-project`:
1. "Re-escanear" → **Escaneo Profundo**

Esto leerá `AlertService.ts`, `UserService.ts`, y `AppConfig.ts` documentando todos los tipos con precisión.
