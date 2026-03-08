# app-ciudadano - Arquitectura de Proyecto

Guia corta para mantener el proyecto ordenado, configurable y escalable.

## 1) Configuracion principal

### Archivo editable (fuente de verdad de branding/theme)
- `src/config/AppBaseConfig.json`
- Aqui cambias:
  - nombre, slug, scheme
  - bundle/package id
  - colores (light/dark)
  - logo (`none`, `local`, `remote`)
  - iconos y splash

### Archivo puente de runtime
- `src/config/AppBaseConfig.ts`
- Este archivo:
  - carga `AppBaseConfig.json`
  - toma `EXPO_PUBLIC_API_BASE_URL` de `.env`
  - construye la configuracion runtime para la app
  - aplica validaciones basicas (ej. URL API requerida)

### Config nativa Expo
- `app.config.js`
- Toma valores del JSON y los aplica a iOS/Android/Web.
- Aqui tambien estan los plugins de build (ej. fix de Pods iOS).

### Context global
- `src/context/AppConfigContext.tsx`
- Expone `useAppConfig()` para leer y modificar config en runtime.

## 2) Regla de .env

Solo se usa para API:

- `EXPO_PUBLIC_API_BASE_URL`

No hardcodear URLs en componentes ni en paginas.

## 3) Estructura recomendada

```txt
src/
  app/                     # rutas Expo Router
  components/              # UI reutilizable
  pages/                   # pantallas por dominio
  services/
    core/                  # cliente HTTP base
    pages/                 # servicios por modulo/pagina
  config/                  # AppBaseConfig.*
  context/                 # estado global de config
  types/                   # tipos globales
  utils/                   # utilidades transversales
```

## 4) APIs con arquitectura por modelos

Flujo recomendado:

1. `Service` consume API (DTO crudo).
2. `Mapper` transforma DTO -> `Model`.
3. `Page` consume `Model`, no DTO crudo.

Ejemplo de organizacion:

```txt
src/
  models/
    CitizenModel.ts
  services/
    pages/
      CitizenService.ts
    mappers/
      CitizenMapper.ts
```

Esto evita acoplar UI al formato real del backend.

## 5) Como crear un nuevo modulo API

1. Crear `src/services/pages/<Modulo>Service.ts`.
2. Definir tipos DTO locales del endpoint.
3. (Recomendado) Crear `src/models/<Modulo>Model.ts`.
4. (Recomendado) Crear `src/services/mappers/<Modulo>Mapper.ts`.
5. Consumir desde `src/pages/<modulo>/<Modulo>Page.tsx`.
6. Manejar estados: loading, success, error.

## 6) Convenciones de nombres

- `PascalCase` para archivos TS/TSX del dominio.
- Excepcion obligatoria en Expo Router:
  - `index.tsx`
  - `_layout.tsx`
  - otros nombres de ruta que definen URL/navegacion

## 7) Cuadro rapido: cuando usar prebuild

Corre `npx expo prebuild --clean` cuando cambies:
- iconos/splash
- plugins de `app.config.js`
- bundle/package id

Si solo cambias:
- colores
- logo runtime
- servicios/API

no necesitas prebuild.

