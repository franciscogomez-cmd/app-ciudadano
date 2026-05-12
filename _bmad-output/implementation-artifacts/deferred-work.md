# Deferred Work

Issues surfaced during review but pre-existing or out of scope for the current story.

---

## Surfaced por: onesignal-subscription-hardening (2026-05-12)

### 1. `handleSubscriptionChange` re-habilita push para usuarios que lo desactivaron explícitamente

Las líneas 62-65 de `NotificationContext.tsx` llaman `optIn()` siempre que `subscriptionChange` llega con `optedIn=false`, incluso si el usuario desactivó notificaciones con `toggleNotifications(false)`. Esto puede reactivar la suscripción en OneSignal aunque la UI muestre notificaciones desactivadas.

**Archivo:** `src/context/NotificationContext.tsx:62-65`
**Acción sugerida:** Añadir guard `notifActivas` o `isRegistered` state antes de llamar `optIn()` en ese bloque.

---

### 2. `getOrCreateDeviceId()` sin guard de concurrencia

Si la función es invocada en paralelo (ej. múltiples inicializaciones simultáneas), ambas llamadas pueden leer `null` y generar UUIDs distintos, donde una sobreescribe a la otra silenciosamente.

**Archivo:** `src/services/users/UserService.ts:92-127`
**Acción sugerida:** Implementar un singleton promise o mutex para serializar llamadas concurrentes.

---

### 3. Sin ruta de migración AsyncStorage → SecureStore para usuarios iOS en upgrade

Usuarios iOS que ya tenían deviceId en AsyncStorage obtendrán un UUID nuevo de SecureStore en la primera apertura tras actualizar. Esto rompe silenciosamente la continuidad de identidad de dispositivo (el 409 los recuperará si el tokenPush coincide, pero si no, se crea un duplicado).

**Archivo:** `src/services/users/UserService.ts:108-127`
**Acción sugerida:** En el path iOS, intentar leer de AsyncStorage como fuente primaria de migración, copiar al SecureStore si existe, y solo generar UUID nuevo si ambos están vacíos.

---

### 4. `console.log` expone estado interno en producción

FCM token (primeros 20 chars), subscriptionIds, y resultados de llamadas al backend se loguean sin guard de `__DEV__`. Considerar una capa de logging condicional.

**Archivos:** `src/context/NotificationContext.tsx`, `src/services/users/UserService.ts`
**Acción sugerida:** Envolver `console.log` relevantes en `if (__DEV__)` o implementar un logger estructurado.

---

### 5. Flujo 409 + `getUserByDevice` null sin feedback al usuario

Si el POST /usuarios devuelve 409 y `getUserByDevice` también falla (red, backend caído), el usuario queda sin registrar en la sesión sin ninguna señal visual ni mecanismo de reintento automático.

**Archivo:** `src/services/users/UserService.ts:180-185`
**Acción sugerida:** Propagar el error hacia la UI o programar reintento con backoff exponencial.
