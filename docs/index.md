# Índice de Documentación — app-ciudadano

> Generado: 2026-05-11 | Modo: Escaneo Rápido | Tipo: Mobile (Expo / React Native)
>
> **Este archivo es el punto de entrada principal para contexto de IA y desarrollo.**

---

## Visión General del Proyecto

| Campo | Valor |
|---|---|
| **Nombre** | Ciudadano |
| **Tipo** | Aplicación móvil (monolito) |
| **Framework** | Expo SDK 55 + React Native 0.83.2 |
| **Lenguaje** | TypeScript 5.9 |
| **Plataformas** | Android, iOS, Web |
| **Navegación** | expo-router (file-based routing) |
| **Estilos** | NativeWind 4 (Tailwind CSS) |
| **Backend** | REST API en Railway (`EXPO_PUBLIC_API_BASE_URL`) |
| **Push Notifications** | OneSignal |
| **Estado global** | React Context API |

**Propósito:** App ciudadana para alertas de emergencia, notificaciones de incidentes, noticias de última hora y mapas de situación en tiempo real. Arquitectura configurable por entorno (branding, colores, APIs) sin necesidad de cambiar código fuente.

---

## Módulos Funcionales

| Módulo | Ruta | Estado |
|---|---|---|
| Alertas y emergencias | `src/app/alertas/` | Implementado |
| Onboarding / permisos | `src/pages/onboarding/` | Implementado |

---

## Documentación Generada

### Core

- [Visión General del Proyecto](./project-overview.md) — propósito, stack tecnológico, módulos, variables de entorno
- [Arquitectura](./architecture-main.md) — capas, patrones, sistema de configuración, flujos de datos
- [Árbol de Fuentes](./source-tree-analysis.md) — estructura completa del proyecto anotada

### Desarrollo

- [Guía de Desarrollo](./development-guide-main.md) — prerrequisitos, instalación, comandos, convenciones, troubleshooting

### Código Fuente

- [API y Servicios](./api-contracts-main.md) — cliente HTTP, servicios detectados, patrón de comunicación
- [Modelos de Datos](./data-models-main.md) — tipos TypeScript, estructura de datos, AsyncStorage
- [Inventario de Componentes](./component-inventory-main.md) — componentes UI, iconos, pantallas, context providers
- [Inventario de Assets](./asset-inventory-main.md) — fuentes, imágenes, íconos, configuración

---

## Documentación Existente (Pre-generada)

- [README.md](../README.md) — inicio rápido, comandos de ejecución, troubleshooting iOS/Android, generación APK
- [ARCHITECTURE.md](../ARCHITECTURE.md) — convenciones, reglas de configuración, guía para nuevos módulos

---

## Inicio Rápido

```bash
# 1. Instalar dependencias
npm install

# 2. Configurar entorno
cp .env.example .env
# Editar .env con EXPO_PUBLIC_API_BASE_URL y EXPO_PUBLIC_ONESIGNAL_APP_ID

# 3. Iniciar
npm run android    # Android
npm run ios        # iOS (requiere macOS)
npm start          # Expo Go / dev build
```

---

## Variables de Entorno

| Variable | Descripción | Requerida |
|---|---|---|
| `EXPO_PUBLIC_API_BASE_URL` | URL base del backend de alertas | Sí |
| `EXPO_PUBLIC_ONESIGNAL_APP_ID` | App ID de OneSignal | Sí |

---

## Archivos Clave de Configuración

| Archivo | Propósito |
|---|---|
| `src/config/AppBaseConfig.json` | **Fuente de verdad** — branding, tema, assets, módulos |
| `src/config/AppBaseConfig.ts` | Bridge de runtime — carga JSON + variables de entorno |
| `app.config.js` | Configuración nativa Expo (iOS/Android/Web) |
| `.env` | Variables secretas de entorno (no commitear) |

---

## Estado de la Documentación

| Documento | Estado |
|---|---|
| Visión general | Completo |
| Arquitectura | Completo |
| Árbol de fuentes | Completo |
| Guía de desarrollo | Completo |
| API y servicios | Rápido — contratos exactos requieren escaneo profundo |
| Modelos de datos | Rápido — tipos exactos requieren escaneo profundo |
| Inventario de componentes | Completo |
| Inventario de assets | Completo |
| Guía de despliegue | _(To be generated)_ |
| Suite de pruebas | N/A — no se encontraron archivos de test |

---

## Próximos Pasos para AI-Assisted Development

1. Para **PRD brownfield**: referenciar este `index.md` como punto de entrada
2. Para **nuevos módulos**: seguir el patrón de `src/app/alertas/` + `src/pages/alerts/` + `src/services/alerts/`
3. Para **contratos de API completos**: ejecutar `/bmad-document-project` → Re-escanear → Escaneo Profundo
4. Para **configuración de branding**: editar `src/config/AppBaseConfig.json` (no código fuente)
