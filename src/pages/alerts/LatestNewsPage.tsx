import { Ionicons } from "@expo/vector-icons";
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
import { type Alert, fetchUserAlerts } from "@/services/alerts/AlertService";
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
  nivel: string,
  palette: ReturnType<typeof useAlertsPalette>,
): string {
  switch (nivel) {
    case "emergencia": return palette.severity.emergency;
    case "preventiva": return palette.severity.preventive;
    default: return palette.severity.informative;
  }
}

function AlertItem({
  alert,
  isExpanded,
  onToggle,
}: {
  alert: Alert;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const palette = useAlertsPalette();
  const accentColor = severityColor(alert.nivelSeveridad, palette);

  const hasMap =
    alert.mapaVisible &&
    alert.centroLatitud != null &&
    alert.centroLongitud != null;

  return (
    <View
      className="overflow-hidden rounded-[22px]"
      style={{
        backgroundColor: palette.cardBackground,
        borderWidth: 1,
        borderColor: palette.cardBorder,
        shadowColor: palette.shadowAccent,
        shadowOpacity: 0.1,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 5 },
        elevation: 4,
      }}
    >
      {/* Header */}
      <Pressable
        onPress={onToggle}
        className="flex-row items-center gap-2 px-4 py-[10px]"
        style={{ backgroundColor: accentColor }}
      >
        {alert.categoria.icono ? (
          <Text style={{ fontSize: 15 }}>{alert.categoria.icono}</Text>
        ) : null}
        <Text
          className="flex-1 font-ubuntu-bold text-[15px] leading-[18px] text-white"
          numberOfLines={1}
        >
          {alert.titulo}
        </Text>
        <Ionicons
          name={isExpanded ? "remove-circle-outline" : "add-circle-outline"}
          size={28}
          color="#FFFFFF"
        />
      </Pressable>

      {/* Fecha siempre visible */}
      <View className="px-4 pt-[10px] pb-3">
        <Text
          className="text-right font-ubuntu-medium text-[12px]"
          style={{ color: palette.subtleText }}
        >
          {formatDate(alert.actualizadoEn)}
        </Text>
      </View>

      {/* Acordeón */}
      {isExpanded && (
        <View
          className="gap-3 pb-4"
          style={{ borderTopWidth: 1, borderTopColor: palette.cardBorder }}
        >
          <View className="gap-2 px-4 pt-3">
            <Text
              className="font-ubuntu-medium text-[14px] leading-[18px]"
              style={{ color: palette.text }}
            >
              Estatus:{" "}
              <Text className="font-ubuntu-bold">
                {alert.estatus.toUpperCase()}
              </Text>
            </Text>

            <Text
              className="font-ubuntu-medium text-[14px] leading-[20px]"
              style={{ color: palette.text }}
            >
              {alert.descripcion}
            </Text>

            {/* Categoría */}
            <View className="flex-row items-center gap-2">
              <View
                style={{ width: 7, height: 7, borderRadius: 3.5, backgroundColor: accentColor }}
              />
              <Text
                className="font-ubuntu-medium text-[12px]"
                style={{ color: palette.subtleText }}
              >
                {alert.categoria.nombre}
              </Text>
            </View>
          </View>

          {/* Mapa */}
          {hasMap && (
            <View style={{ paddingHorizontal: 14 }}>
              <AlertMapView
                latitude={parseFloat(alert.centroLatitud!)}
                longitude={parseFloat(alert.centroLongitud!)}
                radiusKm={alert.radioKm ? parseFloat(alert.radioKm) : undefined}
                colorHex={accentColor}
                height={190}
              />
            </View>
          )}

          {/* Acciones */}
          {alert.acciones.length > 0 && (
            <View className="gap-[6px] px-4">
              <Text
                className="font-ubuntu-bold text-[13px]"
                style={{ color: palette.text }}
              >
                Acciones recomendadas:
              </Text>
              {alert.acciones.map((accion, i) => (
                <View key={i} className="flex-row items-start gap-2">
                  <View
                    style={{
                      marginTop: 5,
                      width: 6,
                      height: 6,
                      borderRadius: 3,
                      backgroundColor: accentColor,
                    }}
                  />
                  <Text
                    className="flex-1 font-ubuntu-medium text-[12px] leading-[17px]"
                    style={{ color: palette.subtleText }}
                  >
                    {accion}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>
      )}
    </View>
  );
}

export function LatestNewsPage() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const palette = useAlertsPalette();
  const { activeTheme } = useAppConfig();

  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  useEffect(() => {
    void loadAlerts();
  }, []);

  async function loadAlerts() {
    try {
      const userId = await getStoredUserId();
      if (!userId) return;
      const response = await fetchUserAlerts(userId, 1, 20);
      setAlerts(response.data);
    } catch {
      // silently fail
    } finally {
      setIsLoading(false);
    }
  }

  function toggleExpanded(alertId: number) {
    setExpandedId((prev) => (prev === alertId ? null : alertId));
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
              Ultimas noticias
            </Text>
          </View>
        </View>

        <View
          className="-mt-1 flex-1 overflow-hidden rounded-t-[42px]"
          style={{ backgroundColor: palette.cardBackground }}
        >
          {isLoading ? (
            <View className="flex-1 items-center justify-center">
              <ActivityIndicator color={palette.severity.emergency} size="large" />
            </View>
          ) : alerts.length === 0 ? (
            <View className="flex-1 items-center justify-center gap-2 px-8">
              <Ionicons name="newspaper-outline" size={48} color={palette.subtleText} />
              <Text
                className="text-center font-ubuntu-medium text-[14px]"
                style={{ color: palette.subtleText }}
              >
                No hay alertas recientes
              </Text>
            </View>
          ) : (
            <ScrollView
              style={{ flex: 1, backgroundColor: palette.cardBackground }}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{
                paddingTop: 26,
                paddingHorizontal: 18,
                paddingBottom: Math.max(insets.bottom + 34, 42),
                gap: 18,
                flexGrow: 1,
              }}
            >
              {alerts.map((alert) => (
                <AlertItem
                  key={alert.id}
                  alert={alert}
                  isExpanded={expandedId === alert.id}
                  onToggle={() => toggleExpanded(alert.id)}
                />
              ))}
            </ScrollView>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}
