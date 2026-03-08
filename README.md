# app-ciudadano (Expo SDK 55)

Arquitectura base para app movil con Expo Router + NativeWind, enfocada en ser configurable por entorno:

- API configurable por `.env`
- tema configurable desde `src/config/AppBaseConfig.json`
- logo configurable desde `src/config/AppBaseConfig.json`
- dark mode configurable (`system`, `light`, `dark`)
- tabs nativas en iOS (`unstable-native-tabs`, estilo liquid glass)
- tabs clasicas en Android/Web
- servicios separados por pagina

## Estructura

```txt
src/
  app/                  # Rutas Expo Router
    (tabs)/
  pages/                # Pantallas por dominio
  components/           # UI reutilizable
  context/              # Estado global de configuracion
  config/               # AppBaseConfig.json + AppBaseConfig.ts
  services/             # API client + servicios por pagina
  utils/                # Helpers (responsivo)
```

## Ejecutar

```bash
npm install
npm run ios
npm run android
npm run web
```

## Ejecutar nativo (prebuild)

```bash
# Regenera ios/ y android/ desde app.config.js y plugins
npx expo prebuild --clean

# Ejecutar en iOS
npx expo run:ios

# Ejecutar en Android
npx expo run:android
```

Usa `npx expo prebuild --clean` solo cuando quieras reconstruir completamente los proyectos nativos.

## Configuracion rapida

1) Edita `.env` solo para API:

- `EXPO_PUBLIC_API_BASE_URL`

2) Edita `src/config/AppBaseConfig.json` para:

- nombre app, slug y scheme
- bundle/package id (`iosBundleIdentifier`, `androidPackage`)
- colores de tema (primario/secundario/fondo/textos)
- modo de tema por defecto: `theme.colorMode` (`system`, `light`, `dark`)
- logo inicial (local/remoto)
- iconos/splash (iOS, Android, web)

`app.config.js` y el contexto cargan esta configuracion base automaticamente.

## Notas

Expo SDK 55 requiere Node `>=20.19.4`. Si usas Node 18, veras warnings y posibles fallos al correr Metro.

## Troubleshooting iOS

Si falla `npx expo run:ios --device`, usa este flujo:

```bash
# 1) Node correcto
nvm use 20.19.4

# 2) Libera Metro si 8081 esta ocupado
lsof -ti:8081 | xargs kill -9

# 3) Regenera nativo iOS con la config actual
npx expo prebuild --clean --platform ios

# 4) Reinstala pods
cd ios
pod install --repo-update
cd ..

# 5) Corre iOS de nuevo
npx expo run:ios --device
```

Este proyecto ya incluye `ios.buildReactNativeFromSource: true` en `app.config.js` para evitar fallos de `Copy XCFrameworks` con `hermes-engine` y `ReactNativeDependencies`.
Tambien incluye el plugin `./plugins/WithFollyHeaderPathFix` para re-aplicar automaticamente el fix de headers de `RCT-Folly` despues de cada `prebuild`.
