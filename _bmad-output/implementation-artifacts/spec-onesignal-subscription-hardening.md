---
title: 'OneSignal Subscription Hardening'
type: 'bugfix'
created: '2026-05-12'
status: 'done'
context: []
baseline_commit: '6d15da2255cdc059a14b55a3d99c2b0591f41c9d'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Tres huecos en el flujo de suscripción OneSignal provocan tokens inválidos sin recuperación: (1) `getOrCreateDeviceId()` usa AsyncStorage —borrado en reinstalación Android—, impidiendo recuperar el registro del backend; (2) cuando el backend reporta `tokenPushValido=false` y el ciclo optOut→optIn produce el **mismo** `subscription_id`, el PATCH al backend nunca se dispara; (3) llamar `optIn()` inmediatamente después de `optOut()` crea una carrera donde OneSignal procesa ambos antes de emitir el evento `subscriptionChange`.

**Approach:** Usar identificadores estables por plataforma para `deviceId` (`Application.androidId` en Android, Keychain vía `expo-secure-store` en iOS); añadir `tokenInvalidoRef` para cruzar la frontera asíncrona y forzar el PATCH aunque el ID no cambie; diferir el `optIn()` del caso tokenInvalido al handler de `subscriptionChange` en lugar de llamarlo inmediatamente después de `optOut()`.

## Boundaries & Constraints

**Always:**
- Instalar paquetes con `npx expo install` (no npm/yarn directo) para que el plugin de Expo los registre correctamente.
- Mantener el prefijo de log `[Notifications]` / `[UserService]` en todos los `console.log` nuevos.
- La recuperación 409 en `registerUser` debe permanecer intacta.
- El PATCH en `handleSubscriptionChange` solo se dispara cuando `state.current.optedIn === true`, evitando un doble-PATCH en el evento intermedio de optOut.

**Ask First:**
- Si `Application.androidId` devuelve `null` en producción (dispositivo raíz o perfil de trabajo), consultar si se acepta un UUID generado guardado en AsyncStorage como fallback permanente.

**Never:**
- Cambiar contratos de la API del backend.
- Modificar `toggleNotifications`, `requestPermissionAndRegister` ni ningún flujo ajeno a tokenInvalido/reinstalación.
- Leer `expo-secure-store` en Android (allí usamos `androidId` directamente).

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Android reinstall | App reinstalada, AsyncStorage vacío | `getOrCreateDeviceId()` retorna el mismo `androidId` → `getUserByDevice` recupera registro → POST 409 → recover | `androidId` null → UUID generado + guardado en AsyncStorage |
| iOS reinstall | App reinstalada, Keychain persiste | `SecureStore.getItemAsync` retorna UUID previo → misma recuperación | SecureStore falla → generar UUID + `SecureStore.setItemAsync` |
| tokenInvalido — mismo subscriptionId | `tokenPushValido=false`, OS mantiene mismo ID después de optOut→optIn | `handleSubscriptionChange` dispara PATCH al backend cuando `optedIn=true` y `tokenInvalidoRef=true` | PATCH fallido → log no-crítico, sin crash |
| tokenInvalido — carrera eliminada | `optOut()` llamado por tokenInvalido | `optIn()` NO se llama inmediatamente; handler detecta `optedIn=false` y llama `optIn()` | Si `subscriptionChange` no llega en 10s (timeout de `getSubscriptionId`), no hay registro nuevo — flujo ya existente |
| Primera instalación (sin datos previos) | Sin AsyncStorage, sin Keychain, sin `androidId` en BD | Android: usa `androidId`; iOS: genera UUID + Keychain; POST /usuarios exitoso | — |

</frozen-after-approval>

## Code Map

- `src/services/users/UserService.ts` — `getOrCreateDeviceId()`: fuente del deviceId; reemplazar lógica AsyncStorage-only
- `src/context/NotificationContext.tsx` — `initialize()`: ciclo tokenInvalido; `handleSubscriptionChange`: trigger del PATCH y del optIn diferido
- `package.json` — dependencias: añadir `expo-application` y `expo-secure-store`

## Tasks & Acceptance

**Execution:**
- [x] Shell -- `npx expo install expo-application expo-secure-store` -- registrar paquetes nativos correctamente en el grafo Expo
- [x] `src/services/users/UserService.ts` -- añadir imports de `expo-application` y `expo-secure-store`; reescribir `getOrCreateDeviceId()` para Android (`Application.getAndroidId()` con fallback UUID en AsyncStorage) y iOS (SecureStore con fallback a generar+guardar UUID) -- persistir deviceId a través de reinstalaciones
- [x] `src/context/NotificationContext.tsx` -- añadir `tokenInvalidoRef = useRef(false)`; en `initialize()` cuando `tokenInvalido`: asignar `tokenInvalidoRef.current = true`, llamar solo `optOut()` y omitir el `optIn()` inmediato de ese bloque condicional; en `handleSubscriptionChange`: ampliar condición del PATCH para incluir `|| tokenInvalidoRef.current` (con guard `optedIn === true`), y limpiar `tokenInvalidoRef.current = false` al disparar -- corregir carrera y forzar PATCH aunque el ID no cambie

**Acceptance Criteria:**
- Dado un dispositivo Android con el app reinstalado y AsyncStorage vacío, cuando `getOrCreateDeviceId()` se ejecuta, entonces retorna el mismo `androidId` que en la instalación anterior (o UUID estable si `androidId` es null).
- Dado un dispositivo iOS con el app reinstalado y Keychain presente, cuando `getOrCreateDeviceId()` se ejecuta, entonces retorna el UUID previamente almacenado en SecureStore.
- Dado un usuario registrado cuyo backend reporta `tokenPushValido=false` y el ciclo optOut→optIn no cambia el subscriptionId, cuando el evento `subscriptionChange` dispara con `optedIn=true`, entonces se llama `updateTokenPush` (PATCH) al backend.
- Dado que `tokenInvalido` es true en `initialize()`, cuando se ejecuta el bloque de permiso, entonces `optIn()` no se llama en ese mismo tick — solo `optOut()`; el `optIn()` se llama en el siguiente `subscriptionChange` con `optedIn=false`.
- Dado cualquier flujo sin tokenInvalido, cuando `initialize()` llama `optIn()`, entonces el comportamiento es idéntico al actual.

## Spec Change Log

## Design Notes

- `tokenInvalidoRef` es un `useRef` (no estado) porque se asigna en `initialize()` y se consume en el closure de `handleSubscriptionChange` ya registrado. Un ref evita el problema de stale closure sin causar re-renders.
- El guard `state.current.optedIn === true` en la condición del PATCH evita dispararlo en el evento intermedio (optedIn=false) del ciclo optOut→optIn, que de otro modo causaría un PATCH con el token aún inactivo.
- En Android, `Application.androidId` es derivado del hardware + firma de la app; es estable entre reinstalaciones pero distinto por app. Puede ser `null` en emuladores o perfiles de trabajo gestionados.
- En iOS, `SecureStore` escribe en el Keychain del sistema, que sobrevive desinstalaciones. La clave usada es `@alertamientos/deviceId` — la misma lógica de namespace que AsyncStorage.

## Verification

**Commands:**
- `npx tsc --noEmit` -- expected: 0 errores de tipo

## Suggested Review Order

**deviceId persistente (UserService)**

- Entrada: lógica de ramificación Android/iOS que reemplaza el UUID en AsyncStorage
  [`UserService.ts:92`](../../src/services/users/UserService.ts#L92)

- Android: `getAndroidId()` con fallback a AsyncStorage y log cuando `androidId` es null
  [`UserService.ts:96`](../../src/services/users/UserService.ts#L96)

- iOS: lectura/escritura en SecureStore (Keychain) con fallback a AsyncStorage
  [`UserService.ts:109`](../../src/services/users/UserService.ts#L109)

**Fix tokenInvalido — carrera y PATCH forzado (NotificationContext)**

- Ref añadido para cruzar la frontera asíncrona optOut→subscriptionChange→optIn
  [`NotificationContext.tsx:38`](../../src/context/NotificationContext.tsx#L38)

- initialize(): solo `optOut()` en el tick tokenInvalido; `optIn()` diferido al handler
  [`NotificationContext.tsx:173`](../../src/context/NotificationContext.tsx#L173)

- handleSubscriptionChange: PATCH forzado con guard `optedIn=true` y `|| tokenInvalidoRef`
  [`NotificationContext.tsx:70`](../../src/context/NotificationContext.tsx#L70)

**Config / dependencias**

- Plugin `expo-secure-store` añadido al array de plugins de Expo
  [`app.config.js:49`](../../app.config.js#L49)
