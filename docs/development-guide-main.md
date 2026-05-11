# Guía de Desarrollo — app-ciudadano

> Generado: 2026-05-11 | Tipo: Mobile (Expo / React Native)

## Prerrequisitos

| Requisito | Versión mínima | Notas |
|---|---|---|
| Node.js | >= 20.19.4 | Node 18 genera warnings con Expo 55. Usar `nvm use 20.19.4` |
| npm | >= 10 | Incluido con Node 20 |
| Expo CLI | global o `npx` | `npx expo <comando>` |
| Android Studio | Última LTS | Para correr en Android |
| Xcode | >= 15 | Solo macOS — para iOS |
| Java (JDK) | >= 17 | Para builds Android |

## Configuración Inicial

### 1. Clonar e instalar dependencias

```bash
git clone <repo>
cd app-ciudadano
npm install
```

### 2. Configurar variables de entorno

```bash
cp .env.example .env
# Editar .env con los valores correctos:
```

```env
EXPO_PUBLIC_API_BASE_URL=https://app-alertamientos-production.up.railway.app/api
EXPO_PUBLIC_ONESIGNAL_APP_ID=<tu-onesignal-app-id>
```

### 3. (Opcional) Configurar branding

Editar `src/config/AppBaseConfig.json` para personalizar:
- Nombre y slug de la app
- Bundle/package identifiers
- Colores del tema (light/dark)
- Logo y assets

## Comandos de Desarrollo

### Iniciar servidor de desarrollo

```bash
npm start          # Expo Go / dev build
npm run android    # Android (emulador o dispositivo)
npm run ios        # iOS (requiere macOS)
npm run web        # Navegador web
```

### Verificación de tipos

```bash
npm run typecheck  # tsc --noEmit
```

### Linting

```bash
npm run lint       # expo lint
```

## Flujo con Builds Nativos (Prebuild)

Expo gestiona los proyectos nativos (`android/`, `ios/`) a través del sistema de plugins. **No editar manualmente** estos directorios.

### Cuándo hacer prebuild

Ejecutar `npx expo prebuild --clean` solo cuando cambies:
- Íconos o splash screen
- Plugins en `app.config.js`
- Bundle ID o package name

No es necesario para cambios en: colores, logo runtime, servicios, API.

### Flujo completo iOS

```bash
nvm use 20.19.4
lsof -ti:8081 | xargs kill -9          # Liberar Metro si está ocupado
npx expo prebuild --clean --platform ios
cd ios && pod install --repo-update && cd ..
npx expo run:ios --device
```

### Build APK Android (Debug)

```bash
cd android && ./gradlew assembleDebug
# APK generado en android/app/build/outputs/apk/debug/
```

## Crear un Nuevo Módulo

Seguir las convenciones de ARCHITECTURE.md:

1. Crear ruta: `src/app/<modulo>/index.tsx` y `src/app/<modulo>/_layout.tsx`
2. Crear pantalla: `src/pages/<modulo>/<Modulo>Page.tsx`
3. Crear servicio: `src/services/<modulo>/<Modulo>Service.ts`
4. (Recomendado) Crear modelo: `src/models/<Modulo>Model.ts`
5. (Recomendado) Crear mapper: `src/services/mappers/<Modulo>Mapper.ts`
6. Registrar tab en `src/app/_layout.tsx` si es navegación de nivel superior

### Estructura del servicio

```typescript
// src/services/<modulo>/<Modulo>Service.ts
import { apiClient } from '../core/ApiClient';

export const ModuloService = {
  getItems: () => apiClient.get('/endpoint'),
  getItem: (id: string) => apiClient.get(`/endpoint/${id}`),
};
```

### Estados en pantallas

Todas las pantallas deben manejar los tres estados:
- `loading` — indicador de carga
- `success` — datos disponibles
- `error` — mensaje de error + opción de reintentar

## Convenciones de Código

| Elemento | Convención |
|---|---|
| Archivos TS/TSX de dominio | `PascalCase` (ej. `AlertsLandingPage.tsx`) |
| Rutas Expo Router | `kebab-case` (ej. `notificaciones-feed.tsx`) |
| Layouts | `_layout.tsx` |
| Rutas índice | `index.tsx` |
| Hooks personalizados | `use<Nombre>.ts` |
| Contextos | `<Nombre>Context.tsx` |
| Servicios | `<Nombre>Service.ts` |
| Modelos | `<Nombre>Model.ts` |
| Mappers | `<Nombre>Mapper.ts` |

## Dependencias y Gestión de Configuración

### No hardcodear en componentes

- URLs de API → usar `EXPO_PUBLIC_API_BASE_URL` o `useAppConfig()`
- Colores → usar clases NativeWind o valores del tema del contexto
- Bundle IDs → solo en `AppBaseConfig.json`

### Acceder a la config en componentes

```typescript
import { useAppConfig } from '@/context/AppConfigContext';

const MyComponent = () => {
  const { config } = useAppConfig();
  // config.theme.light.primary, config.metadata.name, etc.
};
```

## Troubleshooting

| Problema | Solución |
|---|---|
| Metro no inicia | `lsof -ti:8081 \| xargs kill -9` |
| Build iOS falla (Copy XCFrameworks) | Ya incluido `buildReactNativeFromSource: true` en `app.config.js` |
| Error headers RCT-Folly | Plugin `WithFollyHeaderPathFix` se aplica automáticamente en prebuild |
| Warnings de Node | Usar Node >= 20.19.4 con `nvm use 20.19.4` |
| Resetear proyecto a base | `npm run reset-project` |
