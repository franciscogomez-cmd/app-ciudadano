import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";

import {
  AlertNoticeCard,
  AlertScreenScaffold,
  DetailCard,
  NotificationSwitch,
  useAlertsPalette,
} from "@/components/alerts/AlertsUi";
import { AlertMapView } from "@/components/map/AlertMapView";
import { useNotifications } from "@/context/NotificationContext";
import {
  type Notificacion,
  fetchUserNotifications,
  markNotificationAsRead,
} from "@/services/alerts/AlertService";
import { getStoredUserId } from "@/services/users/UserService";

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

function NotificacionCard({
  notif,
  isExpanded,
  onToggle,
}: {
  notif: Notificacion;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const palette = useAlertsPalette();
  const isRead = notif.leidaEn !== null;
  const color = severityColor(notif.alertaNivelSeveridad, palette);

  return (
    <View
      className="overflow-hidden rounded-2xl"
      style={{
        borderWidth: isRead ? 1 : 1.5,
        borderColor: isRead ? palette.cardBorder : color,
        backgroundColor: palette.cardBackground,
      }}
    >
      {/* Header con color de severidad */}
      <Pressable
        onPress={onToggle}
        className="flex-row items-center gap-2 px-3 py-[9px]"
        style={{ backgroundColor: color }}
      >
        {notif.categoriaIcono ? (
          <Text style={{ fontSize: 14 }}>{notif.categoriaIcono}</Text>
        ) : (
          !isRead && (
            <View className="h-2 w-2 rounded-full" style={{ backgroundColor: "#FFFFFF" }} />
          )
        )}
        <Text
          className="flex-1 font-ubuntu-bold text-[13px] text-white"
          numberOfLines={1}
        >
          {notif.alertaTitulo}
        </Text>
        <Ionicons
          name={isExpanded ? "remove-circle-outline" : "add-circle-outline"}
          size={20}
          color="#FFFFFF"
        />
      </Pressable>

      {/* Acordeón */}
      {isExpanded && (
        <View
          className="gap-2 pb-3"
          style={{ borderTopWidth: 1, borderTopColor: palette.cardBorder }}
        >
          <View className="gap-2 px-3 pt-3">
            <Text
              className="font-ubuntu-medium text-[12px] leading-[17px]"
              style={{ color: palette.text }}
            >
              {notif.alertaDescripcion}
            </Text>
            <View className="flex-row items-center gap-2">
              <View
                style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: color }}
              />
              <Text
                className="font-ubuntu-medium text-[11px]"
                style={{ color: palette.subtleText }}
              >
                {notif.categoriaNombre}
              </Text>
            </View>
          </View>

          {notif.alertaCentroLatitud != null && notif.alertaCentroLongitud != null && (
            <View style={{ paddingHorizontal: 12 }}>
              <AlertMapView
                latitude={parseFloat(notif.alertaCentroLatitud)}
                longitude={parseFloat(notif.alertaCentroLongitud)}
                radiusKm={notif.alertaRadioKm ? parseFloat(notif.alertaRadioKm) : undefined}
                colorHex={color}
                height={160}
              />
            </View>
          )}
        </View>
      )}
    </View>
  );
}

export function NotificationsFeedPage() {
  const palette = useAlertsPalette();
  const { notifActivas, isLoading: switchLoading, toggleNotifications } =
    useNotifications();

  const [notifs, setNotifs] = useState<Notificacion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    void loadNotifications();
  }, []);

  async function loadNotifications() {
    try {
      const uid = await getStoredUserId();
      setUserId(uid);
      if (!uid) return;
      const response = await fetchUserNotifications(uid, 1, 10);
      setNotifs(response.data);
    } catch {
      // silently fail
    } finally {
      setIsLoading(false);
    }
  }

  async function toggleExpanded(notif: Notificacion) {
    const opening = expandedId !== notif.id;
    setExpandedId(opening ? notif.id : null);

    if (opening && notif.leidaEn === null && userId) {
      try {
        await markNotificationAsRead(userId, notif.id);
        setNotifs((prev) =>
          prev.map((n) =>
            n.id === notif.id ? { ...n, leidaEn: new Date().toISOString() } : n,
          ),
        );
      } catch {
        // no crítico
      }
    }
  }

  const hasUnread = notifs.some((n) => n.leidaEn === null);

  return (
    <AlertScreenScaffold showBackButton title="Notificaciones">
      <DetailCard style={{ gap: 14 }}>
        {notifs.length > 0 && (
          <AlertNoticeCard
            color={severityColor(notifs[0].alertaNivelSeveridad, palette)}
            title={notifs[0].alertaTitulo}
            description={notifs[0].alertaDescripcion}
          />
        )}

        <Text
          className="font-ubuntu-medium text-[11px] leading-[16px]"
          style={{ color: palette.subtleText }}
        >
          Activa las notificaciones para recibir alertas cada vez que ocurra un
          evento relevante cerca de tu ubicacion.
        </Text>

        <NotificationSwitch
          value={notifActivas}
          disabled={switchLoading}
          onValueChange={(enabled) => {
            void toggleNotifications(enabled);
          }}
        />
      </DetailCard>

      <DetailCard style={{ gap: 10 }}>
        <View className="flex-row items-center justify-between">
          <Text
            className="font-ubuntu-bold text-[14px]"
            style={{ color: palette.text }}
          >
            Notificaciones recibidas
          </Text>
          {hasUnread && (
            <View
              className="rounded-full px-2 py-0.5"
              style={{ backgroundColor: palette.severity.emergency }}
            >
              <Text className="font-ubuntu-bold text-[11px] text-white">
                {notifs.filter((n) => n.leidaEn === null).length} nuevas
              </Text>
            </View>
          )}
        </View>

        {isLoading ? (
          <ActivityIndicator color={palette.severity.emergency} size="small" />
        ) : notifs.length === 0 ? (
          <View className="items-center gap-1 py-2">
            <MaterialCommunityIcons
              name="bell-off-outline"
              size={28}
              color={palette.subtleText}
            />
            <Text
              className="font-ubuntu-medium text-[12px]"
              style={{ color: palette.subtleText }}
            >
              Sin notificaciones aun
            </Text>
          </View>
        ) : (
          notifs.map((notif) => (
            <NotificacionCard
              key={notif.id}
              notif={notif}
              isExpanded={expandedId === notif.id}
              onToggle={() => void toggleExpanded(notif)}
            />
          ))
        )}
      </DetailCard>
    </AlertScreenScaffold>
  );
}
