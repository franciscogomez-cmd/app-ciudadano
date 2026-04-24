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
import {
  type Alert,
  type AlertActualizacion,
  fetchAlertActualizaciones,
  fetchLastAlert,
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
  nivel: string,
  palette: ReturnType<typeof useAlertsPalette>,
): string {
  switch (nivel) {
    case "emergencia": return palette.severity.emergency;
    case "preventiva": return palette.severity.preventive;
    default: return palette.severity.informative;
  }
}

export function LatestNewsPage() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const palette = useAlertsPalette();
  const { activeTheme } = useAppConfig();

  const [alert, setAlert] = useState<Alert | null>(null);
  const [actualizaciones, setActualizaciones] = useState<AlertActualizacion[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const userId = await getStoredUserId();
        if (!userId || !active) return;
        const data = await fetchLastAlert(userId);
        if (!active) return;
        setAlert(data);
        if (data?.id) {
          const updates = await fetchAlertActualizaciones(data.id);
          if (active) setActualizaciones(updates);
        }
      } catch {
        // silently fail
      } finally {
        if (active) setIsLoading(false);
      }
    }
    void load();
    return () => { active = false; };
  }, []);

  const accentColor = alert?.nivelSeveridad
    ? severityColor(alert.nivelSeveridad, palette)
    : palette.severity.informative;

  const hasMap =
    alert?.mapaVisible === true &&
    alert.centroLatitud != null &&
    alert.centroLongitud != null;

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
          ) : !alert ? (
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
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{
                paddingTop: 26,
                paddingHorizontal: 18,
                paddingBottom: Math.max(insets.bottom + 34, 42),
                gap: 14,
              }}
            >
              {/* Header de severidad */}
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
                <View
                  className="flex-row items-center gap-2 px-4 py-[11px]"
                  style={{ backgroundColor: accentColor }}
                >
                  {alert.categoria?.icono ? (
                    <Text style={{ fontSize: 16 }}>{alert.categoria?.icono}</Text>
                  ) : null}
                  <Text
                    className="flex-1 font-ubuntu-bold text-[15px] leading-[18px] text-white"
                    numberOfLines={2}
                  >
                    {alert.titulo}
                  </Text>
                </View>

                {/* Cuerpo siempre visible */}
                <View className="gap-3 px-4 pt-3 pb-4">
                  {/* Fecha y estatus */}
                  <View className="flex-row items-center justify-between">
                    <Text
                      className="font-ubuntu-medium text-[12px]"
                      style={{ color: palette.subtleText }}
                    >
                      {alert.actualizadoEn ? formatDate(alert.actualizadoEn) : ""}
                    </Text>
                    <View
                      className="rounded-full px-3 py-[3px]"
                      style={{ backgroundColor: accentColor + "22" }}
                    >
                      <Text
                        className="font-ubuntu-bold text-[11px]"
                        style={{ color: accentColor }}
                      >
                        {alert.estatus?.toUpperCase()}
                      </Text>
                    </View>
                  </View>

                  {/* Descripción */}
                  <Text
                    className="font-ubuntu-medium text-[14px] leading-[20px]"
                    style={{ color: palette.text }}
                  >
                    {alert.descripcion}
                  </Text>

                  {/* Categoría */}
                  <View className="flex-row items-center gap-2">
                    <View
                      style={{
                        width: 7,
                        height: 7,
                        borderRadius: 3.5,
                        backgroundColor: accentColor,
                      }}
                    />
                    <Text
                      className="font-ubuntu-medium text-[12px]"
                      style={{ color: palette.subtleText }}
                    >
                      {alert.categoria?.nombre}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Mapa */}
              {hasMap && (
                <AlertMapView
                  latitude={parseFloat(alert.centroLatitud!)}
                  longitude={parseFloat(alert.centroLongitud!)}
                  radiusKm={alert.radioKm ? parseFloat(alert.radioKm) : undefined}
                  colorHex={accentColor}
                  height={210}
                />
              )}

              {/* Acciones */}
              {(alert.acciones?.length ?? 0) > 0 && (
                <View
                  className="rounded-[18px] gap-2 px-4 py-4"
                  style={{
                    backgroundColor: palette.cardBackground,
                    borderWidth: 1,
                    borderColor: palette.cardBorder,
                    elevation: 3,
                  }}
                >
                  <Text
                    className="font-ubuntu-bold text-[13px]"
                    style={{ color: palette.text }}
                  >
                    Acciones recomendadas:
                  </Text>
                  {(alert.acciones ?? []).map((accion, i) => (
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
              {/* Historial de actualizaciones */}
              {actualizaciones.length > 0 && (
                <View
                  className="rounded-[18px] overflow-hidden"
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
            </ScrollView>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}
