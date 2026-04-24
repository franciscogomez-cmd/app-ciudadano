import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

import { useAlertsPalette } from "@/components/alerts/AlertsUi";
import { AlertMapView } from "@/components/map/AlertMapView";
import { useAppConfig } from "@/context/AppConfigContext";
import {
  type AlertActualizacion,
  type Notificacion,
  fetchAlertActualizaciones,
  fetchUserNotifications,
  markNotificationAsRead,
} from "@/services/alerts/AlertService";
import { getStoredUserId } from "@/services/users/UserService";

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const months = [
    "enero", "febrero", "marzo", "abril", "mayo", "junio",
    "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
  ];
  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  const hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const ampm = hours >= 12 ? "p.m." : "a.m.";
  const hour12 = hours > 12 ? hours - 12 : hours || 12;
  return `${day} de ${month} ${year} ${hour12}:${minutes} ${ampm}`;
}

function severityColor(
  nivel: string | undefined,
  palette: ReturnType<typeof useAlertsPalette>,
): string {
  switch (nivel) {
    case "emergencia": return palette.severity.emergency;
    case "preventiva": return palette.severity.preventive;
    default: return palette.severity.informative;
  }
}

function NotificacionItem({
  notif,
  isExpanded,
  onToggle,
}: {
  notif: Notificacion;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const palette = useAlertsPalette();
  const accentColor = severityColor(notif.alertaNivelSeveridad, palette);
  const isRead = notif.leidaEn !== null;
  const [actualizaciones, setActualizaciones] = useState<AlertActualizacion[]>([]);

  useEffect(() => {
    if (!isExpanded || !notif.alertaId) return;
    let active = true;
    void fetchAlertActualizaciones(notif.alertaId).then((data) => {
      if (active) setActualizaciones(data);
    });
    return () => { active = false; };
  }, [isExpanded, notif.alertaId]);

  return (
    <View
      className="overflow-hidden rounded-[26px]"
      style={{
        backgroundColor: palette.cardBackground,
        borderWidth: isRead ? 1 : 1.5,
        borderColor: isRead ? palette.cardBorder : accentColor,
        shadowColor: palette.shadowAccent,
        shadowOpacity: 0.12,
        shadowRadius: 14,
        shadowOffset: { width: 0, height: 7 },
        elevation: 4,
      }}
    >
      {/* Header con color de severidad */}
      <View
        className="flex-row items-center px-4 py-[10px]"
        style={{ backgroundColor: accentColor }}
      >
        {!isRead && (
          <View
            className="mr-2 h-2 w-2 rounded-full"
            style={{ backgroundColor: palette.iconOnAccent }}
          />
        )}
        <Text
          className="flex-1 font-ubuntu-bold text-[15px] leading-[18px] text-white"
          numberOfLines={1}
        >
          {notif.alertaTitulo}
        </Text>
      </View>

      {/* Fila principal — toca para abrir/cerrar */}
      <Pressable
        onPress={onToggle}
        className="flex-row items-center gap-[14px] px-4 py-4"
      >
        <View
          className="h-[42px] w-[42px] items-center justify-center rounded-full"
          style={{ backgroundColor: palette.historyBadgeOuter }}
        >
          <View
            className="h-8 w-8 items-center justify-center rounded-full"
            style={{ backgroundColor: accentColor }}
          >
            {notif.categoriaIcono ? (
              <Text style={{ fontSize: 15 }}>{notif.categoriaIcono}</Text>
            ) : (
              <MaterialCommunityIcons
                name="bell-outline"
                size={17}
                color={palette.iconOnAccent}
              />
            )}
          </View>
        </View>

        <View className="flex-1 gap-[3px]">
          <Text
            className="font-ubuntu-medium text-[13px] leading-[16px]"
            style={{ color: palette.subtleText }}
          >
            Recibida el:
          </Text>
          <Text
            className="font-ubuntu-medium text-[14px] leading-[18px]"
            style={{ color: palette.subtleText }}
          >
            {formatDate(notif.creadoEn)}
          </Text>
          <Text
            className="font-ubuntu-bold text-[13px]"
            style={{ color: isRead ? palette.subtleText : accentColor }}
          >
            {isRead ? "Leída" : "No leída"}
          </Text>
        </View>

        <Ionicons
          name={isExpanded ? "remove-circle-outline" : "add-circle-outline"}
          size={34}
          color={palette.historyActionIcon}
        />
      </Pressable>

      {/* Acordeón */}
      {isExpanded && (
        <View
          className="gap-3 pb-5"
          style={{ borderTopWidth: 1, borderTopColor: palette.cardBorder }}
        >
          <View className="gap-3 px-4 pt-3">
            <Text
              className="font-ubuntu-medium text-[13px] leading-[19px]"
              style={{ color: palette.text }}
            >
              {notif.alertaDescripcion}
            </Text>

            <View className="flex-row items-center gap-2">
              <View
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: accentColor,
                }}
              />
              <Text
                className="font-ubuntu-medium text-[12px]"
                style={{ color: palette.subtleText }}
              >
                {notif.categoriaNombre}
              </Text>
            </View>
          </View>

          {notif.alertaCentroLatitud != null && notif.alertaCentroLongitud != null && (
            <View style={{ paddingHorizontal: 14 }}>
              <AlertMapView
                latitude={parseFloat(notif.alertaCentroLatitud)}
                longitude={parseFloat(notif.alertaCentroLongitud)}
                radiusKm={notif.alertaRadioKm ? parseFloat(notif.alertaRadioKm) : undefined}
                colorHex={accentColor}
                height={180}
              />
            </View>
          )}

          {actualizaciones.length > 0 && (
            <View
              className="mx-[14px] overflow-hidden rounded-[18px]"
              style={{
                backgroundColor: palette.cardBackground,
                borderWidth: 1,
                borderColor: palette.cardBorder,
              }}
            >
              <View
                className="px-4 py-3"
                style={{ borderBottomWidth: 1, borderBottomColor: palette.cardBorder }}
              >
                <Text
                  className="font-ubuntu-bold text-[13px]"
                  style={{ color: palette.text }}
                >
                  Historial de actualizaciones
                </Text>
              </View>
              {actualizaciones.map((upd, i) => (
                <View key={upd.id ?? i}>
                  {i > 0 && (
                    <View style={{ height: 1, backgroundColor: palette.cardBorder }} />
                  )}
                  <View className="flex-row items-start gap-3 px-4 py-3">
                    <View
                      style={{
                        marginTop: 4,
                        width: 7,
                        height: 7,
                        borderRadius: 3.5,
                        backgroundColor: accentColor,
                      }}
                    />
                    <View className="flex-1 gap-[3px]">
                      {upd.mensaje ? (
                        <Text
                          className="font-ubuntu-medium text-[13px] leading-[18px]"
                          style={{ color: palette.text }}
                        >
                          {upd.mensaje}
                        </Text>
                      ) : null}
                      {upd.estatusNuevo ? (
                        <View className="flex-row items-center gap-1">
                          <Text
                            className="font-ubuntu-medium text-[11px]"
                            style={{ color: palette.subtleText }}
                          >
                            Estatus:
                          </Text>
                          <Text
                            className="font-ubuntu-bold text-[11px]"
                            style={{ color: palette.subtleText }}
                          >
                            {upd.estatusNuevo.toUpperCase()}
                          </Text>
                        </View>
                      ) : null}
                      {upd.creadoEn ? (
                        <Text
                          className="font-ubuntu-medium text-[11px]"
                          style={{ color: palette.subtleText, opacity: 0.6 }}
                        >
                          {formatDate(upd.creadoEn)}
                        </Text>
                      ) : null}
                    </View>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>
      )}
    </View>
  );
}

export function AlertHistoryPage() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const palette = useAlertsPalette();
  const { activeTheme } = useAppConfig();

  const [notifs, setNotifs] = useState<Notificacion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const uid = await getStoredUserId();
        if (!active) return;
        setUserId(uid);
        if (!uid) return;
        const response = await fetchUserNotifications(uid);
        if (!active) return;
        setNotifs(response.data);
      } catch {
        // silently fail, show empty state
      } finally {
        if (active) setIsLoading(false);
      }
    }
    void load();
    return () => { active = false; };
  }, []);

  // Marca como leída después de que el acordeón haya comprometido al DOM
  useEffect(() => {
    if (expandedId === null || !userId) return;
    const notif = notifs.find((n) => n.id === expandedId);
    if (!notif || notif.leidaEn !== null) return;

    let active = true;
    void markNotificationAsRead(userId, expandedId)
      .then(() => {
        if (!active) return;
        setNotifs((prev) =>
          prev.map((n) =>
            n.id === expandedId ? { ...n, leidaEn: new Date().toISOString() } : n,
          ),
        );
      })
      .catch(() => {});
    return () => { active = false; };
  }, [expandedId, userId]);

  function toggleExpanded(notifId: number) {
    setExpandedId((prev) => (prev === notifId ? null : notifId));
  }

  return (
    <SafeAreaView
      edges={["top"]}
      className="flex-1"
      style={{ backgroundColor: palette.shellBackground }}
    >
      <StatusBar style={activeTheme.statusBarStyle} />
      <View className="flex-1">
        <View
          className="px-5 pt-3 pb-[18px]"
          style={{ backgroundColor: palette.shellBackground }}
        >
          <View className="min-h-9 flex-row items-center gap-3">
            <Pressable
              accessibilityRole="button"
              onPress={() => router.back()}
              style={{ paddingVertical: 4, paddingRight: 4 }}
            >
              <Ionicons
                name="chevron-back"
                size={24}
                color={palette.buttonText}
              />
            </Pressable>
            <Text
              className="font-ubuntu-bold text-[17px] leading-[22px]"
              style={{ color: palette.buttonText }}
            >
              Historial de alertas
            </Text>
          </View>
        </View>

        <View
          className="-mt-1 flex-1 overflow-hidden rounded-t-[42px]"
          style={{ backgroundColor: palette.cardBackground }}
        >
          {isLoading ? (
            <View className="flex-1 items-center justify-center">
              <ActivityIndicator
                color={palette.severity.emergency}
                size="large"
              />
            </View>
          ) : notifs.length === 0 ? (
            <View className="flex-1 items-center justify-center gap-2 px-8">
              <MaterialCommunityIcons
                name="bell-off-outline"
                size={48}
                color={palette.subtleText}
              />
              <Text
                className="text-center font-ubuntu-medium text-[14px]"
                style={{ color: palette.subtleText }}
              >
                No tienes notificaciones aun
              </Text>
            </View>
          ) : (
            <ScrollView
              style={{ backgroundColor: palette.cardBackground }}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{
                paddingTop: 26,
                paddingHorizontal: 18,
                paddingBottom: Math.max(insets.bottom + 32, 40),
                gap: 22,
                flexGrow: 1,
                minHeight: "100%",
              }}
            >
              {notifs.map((notif) => (
                <NotificacionItem
                  key={notif.id}
                  notif={notif}
                  isExpanded={expandedId === notif.id}
                  onToggle={() => toggleExpanded(notif.id)}
                />
              ))}
            </ScrollView>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}
