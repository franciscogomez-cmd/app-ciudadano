# Inventario de Assets — app-ciudadano

> Generado: 2026-05-11 | Tipo: Mobile (Expo / React Native) | Escaneo: Rápido

## Fuentes (`assets/fonts/`)

| Archivo | Familia | Peso | Uso |
|---|---|---|---|
| `Ubuntu-R.ttf` | Ubuntu | Regular (400) | Texto de cuerpo |
| `Ubuntu-M.ttf` | Ubuntu | Medium (500) | Subtítulos |
| `Ubuntu-B.ttf` | Ubuntu | Bold (700) | Títulos y énfasis |

Cargadas en el layout raíz (`src/app/_layout.tsx`) con `expo-font`.

---

## Imágenes (`assets/images/`)

### Íconos de Aplicación

| Archivo | Uso | Plataforma |
|---|---|---|
| `icon.png` | Ícono de app universal | Todas |
| `android-icon-foreground.png` | Capa frontal del ícono adaptativo | Android |
| `android-icon-background.png` | Capa de fondo del ícono adaptativo | Android |
| `android-icon-monochrome.png` | Ícono monocromático (Android 13+) | Android |
| `favicon.png` | Favicon | Web |

### Splash Screen

| Archivo | Uso |
|---|---|
| `splash-icon.png` | Splash screen (light y dark — mismo archivo) |

Configurado en `app.config.js`:
- Background color (light): `#D9D9D9`
- Background color (dark): `#2D2B27`
- Ancho de imagen: 92px

### Logo

| Archivo | Uso |
|---|---|
| `logo.png` | Logo de la app |
| `logo-glow.png` | Logo con efecto glow (dark mode / branding especial) |

### Íconos de Pestañas

| Archivo | Resoluciones | Uso |
|---|---|---|
| `tabIcons/home.png` | 1x, 2x, 3x | Tab inicio |
| `tabIcons/explore.png` | 1x, 2x, 3x | Tab explorar |

### Assets Expo (referencias)

| Archivo | Uso |
|---|---|
| `expo-logo.png` | Referencia Expo (no usada en producción) |
| `expo-badge.png` / `expo-badge-white.png` | Badges Expo |
| `react-logo.png` / `@2x` / `@3x` | Assets de referencia React |
| `tutorial-web.png` | Tutorial web (no usada en producción) |

---

## Assets del Sistema de Configuración (`assets/expo.icon/`)

| Archivo | Uso |
|---|---|
| `icon.json` | Configuración de ícono para herramientas Expo |
| `Assets/grid.png` | Grid de referencia |
| `Assets/expo-symbol 2.svg` | Símbolo SVG de Expo |

---

## Configuración de Assets en `AppBaseConfig.json`

Los assets críticos están referenciados en la fuente de verdad:

```json
{
  "assets": {
    "appIcon": "./assets/images/icon.png",
    "iosIcon": "./assets/images/icon.png",
    "webFavicon": "./assets/images/favicon.png",
    "androidAdaptiveIcon": {
      "backgroundColor": "#D9D9D9",
      "foregroundImage": "./assets/images/icon.png",
      "monochromeImage": "./assets/images/icon.png"
    },
    "splash": {
      "image": "./assets/images/splash-icon.png",
      "darkImage": "./assets/images/splash-icon.png",
      "backgroundColor": "#D9D9D9",
      "darkBackgroundColor": "#2D2B27",
      "imageWidth": 92
    }
  }
}
```

Para cambiar íconos o splash: editar `AppBaseConfig.json` y ejecutar `npx expo prebuild --clean`.

---

## Notas de Producción

- Los archivos `expo-logo.png`, `react-logo.png`, `tutorial-web.png` y assets similares son residuos del template inicial de Expo. Pueden eliminarse si no se usan.
- El ícono `android-icon-foreground.png` está referenciado como `icon.png` en el JSON — verificar si son archivos distintos o el mismo.
