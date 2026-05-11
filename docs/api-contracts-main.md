# API y Servicios — app-ciudadano

> Generado: 2026-05-11 | Tipo: Mobile (Expo / React Native) | Escaneo: Rápido (basado en estructura de archivos)

> **Nota:** Este documento fue generado en modo de escaneo rápido (sin leer código fuente). Los endpoints específicos y los contratos de request/response deben verificarse leyendo directamente los archivos de servicio. Ver [Escaneo Profundo](#escaneo-profundo) para obtener documentación completa.

## Backend

| Campo | Valor |
|---|---|
| URL Base (producción) | `https://app-alertamientos-production.up.railway.app/api` |
| Configuración | Variable de entorno `EXPO_PUBLIC_API_BASE_URL` |
| Headers por defecto | `Accept: application/json`, `Content-Type: application/json` |
| Cliente HTTP | `src/services/core/ApiClient.ts` |

## Cliente HTTP Base

**Archivo:** `src/services/core/ApiClient.ts`

Centraliza toda comunicación HTTP. Lee `EXPO_PUBLIC_API_BASE_URL` en runtime.
Aplica los headers por defecto definidos en `AppBaseConfig.json → apiDefaults.defaultHeaders`.

## Servicios Detectados

### AlertService (`src/services/alerts/AlertService.ts`)

Gestiona el acceso a datos del módulo de alertas y noticias.

Funcionalidad esperada (inferida de pantallas):
- Obtener alertas activas
- Obtener historial de alertas
- Obtener detalles de un incidente
- Obtener feed de últimas noticias

### UserService (`src/services/users/UserService.ts`)

Gestiona el estado del usuario y autenticación con el backend.

Funcionalidad esperada (inferida de contexto):
- Validar usuario en backend al iniciar la app
- Sincronizar permisos del dispositivo
- Limpiar storage si el usuario no existe en backend

## Convención de Servicios

Todos los servicios del proyecto deben:

1. Importar desde `ApiClient.ts` como cliente HTTP base
2. Definir tipos DTO locales del endpoint consumido
3. Separar DTOs de los modelos de dominio (patrón Mapper)

**Patrón recomendado:**

```
src/services/<modulo>/<Modulo>Service.ts    ← consume API, retorna DTO
src/models/<Modulo>Model.ts                 ← tipo del dominio
src/services/mappers/<Modulo>Mapper.ts      ← transforma DTO → Model
```

## Flujo de Autenticación

Basado en el commit reciente (`a97af07`):
- Al arrancar la app, se valida el usuario en el backend
- Si el usuario no existe en backend, se limpia el storage local
- El `UserService` gestiona este ciclo de vida

## Notificaciones Push (OneSignal)

Las notificaciones push no pasan por el `ApiClient` — usan el SDK de OneSignal directamente.

| Campo | Descripción |
|---|---|
| App ID | `EXPO_PUBLIC_ONESIGNAL_APP_ID` (variable de entorno) |
| Integración | `react-native-onesignal` + `onesignal-expo-plugin` |
| Estado | Gestionado por `NotificationContext.tsx` |
| Permisos | Sincronizados con backend via `usePermissionSync.ts` |

---

## Escaneo Profundo

Para obtener los contratos completos de request/response, ejecutar `/bmad-document-project` y seleccionar:
1. "Re-escanear proyecto" (opción 1)
2. **Escaneo Profundo** (opción 2)

Esto leerá los archivos de servicio y documentará los endpoints con sus esquemas exactos.
