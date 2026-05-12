import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { Href, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  AppState,
  type AppStateStatus,
  Image,
  Linking,
  Modal,
  Pressable,
  Text,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useAlertsPalette } from "@/components/alerts/AlertsUi";
import {
  HistorialAlertasIcon,
  NivelesSeguridadIcon,
  NotificacionesIcon,
  UltimasNoticiasIcon,
} from "@/components/icons";
import { useAppConfig } from "@/context/AppConfigContext";
import {
  getStoredUbicacionGuardada,
  getStoredUserId,
  updateUserLocation,
} from "@/services/users/UserService";

// Estados posibles del flujo de ubicación
type LocationStatus =
  | "checking"         // verificando permisos al montar / al volver de Settings
  | "loading"          // guardando ubicación en el backend
  | "success"          // ubicación guardada correctamente
  | "error_permission" // sin permiso, el OS puede mostrar diálogo
  | "blocked"          // sin permiso, negado permanente → solo Settings
  | "error_api";       // permiso OK pero el endpoint falló → reintentar

type AlertFeatureCardProps = {
  icon: React.ReactNode;
  label: string;
  route: Href;
  backgroundColor: string;
  labelColor: string;
};

function AlertFeatureCard({
  icon,
  label,
  route,
  backgroundColor,
  labelColor,
}: AlertFeatureCardProps) {
  const router = useRouter();
  const palette = useAlertsPalette();

  return (
    <View
      className="flex-1 rounded-[12px]"
      style={{
        height: 149,
        backgroundColor,
        shadowColor: palette.shadowColor,
        shadowOpacity: 0.22,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
        elevation: 5,
      }}
    >
      <Pressable
        accessibilityRole="button"
        onPress={() => router.push(route)}
        className="flex-1 items-center justify-center gap-3 overflow-hidden rounded-[12px]"
        style={({ pressed }) => ({ opacity: pressed ? 0.9 : 1, flex: 1 })}
      >
        <View className="w-[72px] h-[72px] items-center justify-center">
          {icon}
        </View>
        <Text
          className="text-center font-ubuntu-medium text-[12px] leading-[20px]"
          style={{ color: labelColor }}
        >
          {label}
        </Text>
      </Pressable>
    </View>
  );
}

function ActionButton({
  label,
  onPress,
  disabled,
  backgroundColor,
  textColor,
}: {
  label: string;
  onPress?: () => void;
  disabled?: boolean;
  backgroundColor: string;
  textColor: string;
}) {
  const palette = useAlertsPalette();

  return (
    <View
      className="h-[50px] rounded-[14px]"
      style={{
        backgroundColor,
        opacity: disabled ? 0.6 : 1,
        shadowColor: palette.shadowColor,
        shadowOpacity: disabled ? 0 : 0.28,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
        elevation: disabled ? 0 : 6,
      }}
    >
      <Pressable
        accessibilityRole="button"
        onPress={disabled ? undefined : onPress}
        className="flex-1 items-center justify-center rounded-[14px]"
        style={({ pressed }) => ({
          opacity: disabled ? 1 : pressed ? 0.88 : 1,
        })}
      >
        <Text
          className="font-ubuntu-bold text-[15px] leading-[20px]"
          style={{ color: textColor }}
        >
          {label}
        </Text>
      </Pressable>
    </View>
  );
}

function LocationCard({
  status,
  onActivar,
  onReintentar,
  onActualizar,
}: {
  status: LocationStatus;
  onActivar: () => void;
  onReintentar: () => void;
  onActualizar: () => void;
}) {
  const palette = useAlertsPalette();

  if (status === "checking" || status === "loading") return null;

  return (
    <View
      className="rounded-[16px] px-[18px] py-[16px] gap-[12px]"
      style={{
        backgroundColor: palette.cardBackground,
        shadowColor: palette.shadowColor,
        shadowOpacity: 0.22,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
        elevation: 5,
      }}
    >
      {/* Éxito */}
      {status === "success" && (
        <>
          <View className="flex-row items-center gap-2">
            <Ionicons name="checkmark-circle" size={20} color={palette.switchActive} />
            <Text
              className="font-ubuntu-bold text-[14px] leading-[18px]"
              style={{ color: palette.text }}
            >
              Ubicación guardada
            </Text>
          </View>
          <ActionButton
            label="Actualizar ubicación"
            backgroundColor={palette.actionBackground}
            textColor={palette.actionText}
            onPress={onActualizar}
          />
        </>
      )}

      {/* Sin permiso — puede pedir diálogo */}
      {status === "error_permission" && (
        <ActionButton
          label="Activar GPS"
          backgroundColor={palette.actionBackground}
          textColor={palette.actionText}
          onPress={onActivar}
        />
      )}

      {/* Sin permiso — negado permanente */}
      {status === "blocked" && (
        <>
          <Text
            className="font-ubuntu-medium text-[13px] leading-[18px]"
            style={{ color: palette.subtleText }}
          >
            Activa la ubicación desde Configuración del sistema para recibir alertas en tu zona.
          </Text>
          <ActionButton
            label="Ir a Configuración"
            backgroundColor={palette.actionBackground}
            textColor={palette.actionText}
            onPress={onActivar}
          />
        </>
      )}

      {/* Error del API */}
      {status === "error_api" && (
        <>
          <View className="flex-row items-center gap-2">
            <Ionicons name="warning-outline" size={18} color={palette.severity?.preventive ?? palette.subtleText} />
            <Text
              className="font-ubuntu-medium text-[13px] leading-[18px] flex-1"
              style={{ color: palette.subtleText }}
            >
              No se pudo guardar la ubicación.
            </Text>
          </View>
          <ActionButton
            label="Reintentar"
            backgroundColor={palette.actionBackground}
            textColor={palette.actionText}
            onPress={onReintentar}
          />
        </>
      )}
    </View>
  );
}

function ConfirmLocationModal({
  visible,
  onCancel,
  onConfirm,
}: {
  visible: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  const palette = useAlertsPalette();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View
        className="flex-1 items-center justify-center px-6"
        style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
      >
        <View
          className="w-full rounded-[20px] p-6 gap-5"
          style={{ backgroundColor: palette.cardBackground }}
        >
          {/* Encabezado */}
          <View className="flex-row items-center gap-3">
            <Ionicons name="location" size={24} color={palette.actionBackground} />
            <Text
              className="font-ubuntu-bold text-[18px] leading-[22px]"
              style={{ color: palette.text }}
            >
              Actualizar ubicación
            </Text>
          </View>

          {/* Descripción */}
          <Text
            className="font-ubuntu-medium text-[14px] leading-[20px]"
            style={{ color: palette.text }}
          >
            Tu ubicación de alertas será reemplazada por tu posición actual.
          </Text>

          {/* Detalle informativo */}
          <View
            className="rounded-[12px] p-4 gap-3"
            style={{ backgroundColor: palette.shellBackground }}
          >
            <View className="flex-row items-start gap-2">
              <Ionicons name="notifications" size={16} color={palette.actionBackground} style={{ marginTop: 2 }} />
              <Text
                className="font-ubuntu-medium text-[13px] leading-[18px] flex-1"
                style={{ color: palette.subtleText }}
              >
                Recibirás alertas correspondientes a tu nueva ubicación.
              </Text>
            </View>
            <View className="flex-row items-start gap-2">
              <Ionicons name="information-circle" size={16} color={palette.actionBackground} style={{ marginTop: 2 }} />
              <Text
                className="font-ubuntu-medium text-[13px] leading-[18px] flex-1"
                style={{ color: palette.subtleText }}
              >
                Si estás fuera de tu ciudad de origen, dejarás de recibir las alertas habituales de esa zona.
              </Text>
            </View>
          </View>

          {/* Acciones */}
          <View className="flex-row gap-3">
            <View className="flex-1">
              <ActionButton
                label="Cancelar"
                backgroundColor={palette.shellBackground}
                textColor={palette.subtleText}
                onPress={onCancel}
              />
            </View>
            <View className="flex-1">
              <ActionButton
                label="Actualizar"
                backgroundColor={palette.actionBackground}
                textColor={palette.actionText}
                onPress={onConfirm}
              />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

export function AlertsLandingPage() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const palette = useAlertsPalette();
  const { activeTheme } = useAppConfig();
  const [locationStatus, setLocationStatus] = useState<LocationStatus>("checking");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const appState = useRef(AppState.currentState);

  // Intenta guardar la ubicación en el backend. Actualiza el estado según resultado.
  const attemptSave = useCallback(async () => {
    setLocationStatus("loading");
    Toast.show({
      type: "info",
      text1: "Guardando ubicación...",
      autoHide: false,
      position: "top",
    });
    try {
      const [userId, pos] = await Promise.all([
        getStoredUserId(),
        Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced }),
      ]);
      if (!userId) {
        Toast.show({ type: "error", text1: "No se pudo guardar la ubicación", position: "top" });
        setLocationStatus("error_api");
        return;
      }
      await updateUserLocation(userId, pos.coords.latitude, pos.coords.longitude);
      Toast.show({ type: "success", text1: "Ubicación guardada", position: "top" });
      setLocationStatus("success");
    } catch {
      Toast.show({ type: "error", text1: "No se pudo guardar la ubicación", position: "top" });
      setLocationStatus("error_api");
    }
  }, []);

  // Verifica permisos y lanza el flujo correcto según el estado del OS.
  // Solo intenta guardar si el backend aún no tiene coordenadas.
  const checkAndSync = useCallback(async () => {
    setLocationStatus("checking");

    const ubicacionGuardada = await getStoredUbicacionGuardada();
    if (ubicacionGuardada) {
      setLocationStatus("success");
      return;
    }

    const { status, canAskAgain } = await Location.getForegroundPermissionsAsync();

    if (status === "granted") {
      await attemptSave();
      return;
    }

    setLocationStatus(canAskAgain ? "error_permission" : "blocked");
  }, [attemptSave]);

  useEffect(() => {
    void checkAndSync();
  }, [checkAndSync]);

  // Re-verificar cuando el usuario regresa de Configuración del sistema
  useEffect(() => {
    const sub = AppState.addEventListener("change", (next: AppStateStatus) => {
      if (appState.current.match(/inactive|background/) && next === "active") {
        void checkAndSync();
      }
      appState.current = next;
    });
    return () => sub.remove();
  }, [checkAndSync]);

  // Botón "Activar GPS" / "Ir a Configuración"
  async function handleActivar() {
    const { status, canAskAgain } = await Location.getForegroundPermissionsAsync();

    if (status === "granted") {
      await attemptSave();
      return;
    }

    if (!canAskAgain) {
      void Linking.openSettings();
      return;
    }

    const { status: newStatus, canAskAgain: stillCan } =
      await Location.requestForegroundPermissionsAsync();

    if (newStatus === "granted") {
      await attemptSave();
    } else {
      setLocationStatus(stillCan ? "error_permission" : "blocked");
    }
  }

  return (
    <View className="flex-1" style={{ backgroundColor: palette.shellBackground }}>
      <StatusBar style={activeTheme.statusBarStyle} />

      <View
        className="flex-row items-center justify-between px-6 pb-5"
        style={{ paddingTop: insets.top + 8 }}
      >
        <Text
          className="font-ubuntu-bold text-[42px] leading-[44px]"
          style={{ color: palette.buttonText }}
        >
          Alertas
        </Text>

        <Image
          source={require("../../../assets/images/logo.png")}
          style={{ width: 170, height: 50 }}
          resizeMode="contain"
        />
      </View>

      <View
        className="mb-16 flex-1 overflow-hidden rounded-[52px]"
        style={{ backgroundColor: palette.cardBackground }}
      >
        <View
          className="flex-1 justify-center"
          style={{
            padding: 24,
            gap: 16,
            paddingBottom: Math.max(insets.bottom + 24, 48),
          }}
        >
          <View className="flex-row gap-4">
            <AlertFeatureCard
              icon={<HistorialAlertasIcon size={60} color={palette.tileIcon} />}
              label="Historial de alertas"
              route="/alertas/historial"
              backgroundColor={palette.cardBackground}
              labelColor={palette.tileText}
            />
            <AlertFeatureCard
              icon={<NotificacionesIcon size={60} color={palette.tileIcon} />}
              label="Notificaciones"
              route="/alertas/notificaciones"
              backgroundColor={palette.cardBackground}
              labelColor={palette.tileText}
            />
          </View>

          <View className="flex-row gap-4">
            <AlertFeatureCard
              icon={<NivelesSeguridadIcon size={60} color={palette.tileIcon} />}
              label="Niveles de severidad"
              route="/alertas/niveles"
              backgroundColor={palette.cardBackground}
              labelColor={palette.tileText}
            />
            <AlertFeatureCard
              icon={<UltimasNoticiasIcon size={60} color={palette.tileIcon} />}
              label="Últimas noticias"
              route="/alertas/noticias"
              backgroundColor={palette.cardBackground}
              labelColor={palette.tileText}
            />
          </View>

          <LocationCard
            status={locationStatus}
            onActivar={handleActivar}
            onReintentar={attemptSave}
            onActualizar={() => setShowConfirmModal(true)}
          />
        </View>
      </View>

      <View
        pointerEvents="box-none"
        style={{
          position: "absolute",
          right: 16,
          bottom: Math.max(insets.bottom + 2, 6),
          zIndex: 30,
        }}
      >
        <View
          className="h-[60px] w-[60px] rounded-full"
          style={{
            backgroundColor: palette.actionBackground,
            shadowColor: palette.shadowColor,
            shadowOpacity: 0.24,
            shadowRadius: 10,
            shadowOffset: { width: 0, height: 5 },
            elevation: 8,
          }}
        >
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Ver onboarding"
            onPress={() => router.push("/tutorial")}
            className="flex-1 items-center justify-center rounded-full"
            style={({ pressed }) => ({ opacity: pressed ? 0.88 : 1 })}
          >
            <Ionicons
              name="information-circle-outline"
              size={30}
              color={palette.iconOnAccent}
            />
          </Pressable>
        </View>
      </View>

      <ConfirmLocationModal
        visible={showConfirmModal}
        onCancel={() => setShowConfirmModal(false)}
        onConfirm={() => {
          setShowConfirmModal(false);
          void attemptSave();
        }}
      />
    </View>
  );
}
