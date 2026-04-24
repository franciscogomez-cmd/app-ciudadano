import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { Pressable, ScrollView, Switch, Text, View } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

import { useAlertsPalette } from "@/components/alerts/AlertsUi";
import {
  AlertaMeteorologicaIcon,
  NoticiasUltimaHoraIcon,
} from "@/components/icons";
import { AlertMapView } from "@/components/map/AlertMapView";
import { useAppConfig } from "@/context/AppConfigContext";
import { useNotifications } from "@/context/NotificationContext";
import {
  type UserProfile,
  fetchUserProfile,
  getStoredUserId,
} from "@/services/users/UserService";

function NotificationInfoCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  const palette = useAlertsPalette();

  return (
    <View
      className="rounded-[18px] border px-[14px] py-[12px]"
      style={{
        backgroundColor: palette.cardBackground,
        borderColor: palette.cardBorder,
        shadowColor: palette.shadowAccent,
        shadowOpacity: 0.12,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
        elevation: 4,
      }}
    >
      <View className="flex-row items-start gap-3">
        <View className="pt-[1px]">{icon}</View>

        <View className="flex-1 gap-0.5">
          <Text
            className="font-ubuntu-bold text-[15px] leading-[18px]"
            style={{ color: palette.text }}
          >
            {title}
          </Text>
          <Text
            className="font-ubuntu-medium text-[12px] leading-[16px]"
            style={{ color: palette.subtleText }}
          >
            {description}
          </Text>
        </View>
      </View>
    </View>
  );
}

function NotificationPreferenceCard({
  value,
  onValueChange,
  isLoading,
}: {
  value: boolean;
  onValueChange: (nextValue: boolean) => void;
  isLoading: boolean;
}) {
  const palette = useAlertsPalette();

  return (
    <View
      className="rounded-[18px] border px-[14px] pt-[12px] pb-[14px]"
      style={{
        backgroundColor: palette.cardBackground,
        borderColor: palette.cardBorder,
        shadowColor: palette.shadowAccent,
        shadowOpacity: 0.1,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
        elevation: 3,
      }}
    >
      <Text
        className="font-ubuntu-medium text-[12px] leading-[16px]"
        style={{ color: palette.subtleText }}
      >
        Activa las notificaciones para recibir alertas cuando ocurra una
        situacion relevante cerca de tu ubicacion
      </Text>

      <View className="mt-[10px] flex-row items-center justify-between gap-3">
        <Text
          className="flex-1 font-ubuntu-bold text-[15px] leading-[18px]"
          style={{ color: palette.text }}
        >
          Activar notificaciones
        </Text>

        <View style={{ transform: [{ scaleX: 0.92 }, { scaleY: 0.92 }] }}>
          <Switch
            value={value}
            onValueChange={onValueChange}
            disabled={isLoading}
            trackColor={{
              false: palette.switchInactive,
              true: palette.switchActive,
            }}
            thumbColor={palette.iconOnAccent}
            ios_backgroundColor={palette.switchInactive}
          />
        </View>
      </View>
    </View>
  );
}

export function NotificationsPage() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const palette = useAlertsPalette();
  const { activeTheme } = useAppConfig();
  const {
    notifActivas,
    isPermissionGranted,
    isRegistered,
    isLoading,
    toggleNotifications,
    openSystemSettings,
  } = useNotifications();

  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    let active = true;
    async function load() {
      const uid = await getStoredUserId();
      if (!uid || !active) return;
      const profile = await fetchUserProfile(uid);
      if (active) setUserProfile(profile);
    }
    void load();
    return () => { active = false; };
  }, []);

  const showPermissionBanner = isRegistered && !isPermissionGranted;

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
              Notificaciones
            </Text>
          </View>
        </View>

        <View
          className="-mt-1 flex-1 overflow-hidden rounded-t-[42px]"
          style={{ backgroundColor: palette.cardBackground }}
        >
          <ScrollView
            style={{ flex: 1, backgroundColor: palette.cardBackground }}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingTop: 26,
              paddingHorizontal: 22,
              paddingBottom: Math.max(insets.bottom + 34, 42),
              gap: 14,
              flexGrow: 1,
            }}
          >
            <NotificationInfoCard
              icon={
                <AlertaMeteorologicaIcon
                  size={44}
                  fillColor={palette.severity.emergency}
                  strokeColor={palette.iconOnAccent}
                />
              }
              title="Alertas meteorologicas"
              description="Recibe notificaciones sobre fenomenos meteorologicos que puedan afectar tu zona, como tormentas, inundaciones o huracanes."
            />

            <NotificationInfoCard
              icon={
                <NoticiasUltimaHoraIcon
                  size={44}
                  fillColor={palette.severity.emergency}
                  strokeColor={palette.iconOnAccent}
                />
              }
              title="Noticias de ultima hora"
              description="Recibe avisos sobre eventos o situaciones importantes que puedan impactar tu localidad."
            />

            {userProfile?.latitud != null && userProfile?.longitud != null && (
              <AlertMapView
                latitude={parseFloat(userProfile.latitud)}
                longitude={parseFloat(userProfile.longitud)}
                colorHex={palette.severity.emergency}
                height={200}
              />
            )}

            <NotificationPreferenceCard
              value={notifActivas}
              onValueChange={(enabled) => {
                void toggleNotifications(enabled);
              }}
              isLoading={isLoading}
            />

            {showPermissionBanner && (
              <View
                className="rounded-[18px] border px-[14px] py-[14px]"
                style={{
                  backgroundColor: palette.cardBackground,
                  borderColor: palette.severity.preventive,
                }}
              >
                <Text
                  className="font-ubuntu-bold text-[14px] leading-[18px]"
                  style={{ color: palette.text }}
                >
                  Notificaciones desactivadas
                </Text>
                <Text
                  className="font-ubuntu-medium text-[12px] leading-[16px] mt-1"
                  style={{ color: palette.subtleText }}
                >
                  Para recibir alertas activa los permisos en la configuracion
                  de tu dispositivo.
                </Text>
                <Pressable
                  onPress={openSystemSettings}
                  className="mt-[10px] self-start rounded-[10px] px-[14px] py-[8px]"
                  style={{ backgroundColor: palette.switchActive }}
                >
                  <Text
                    className="font-ubuntu-bold text-[13px]"
                    style={{ color: palette.iconOnAccent }}
                  >
                    Ir a configuracion
                  </Text>
                </Pressable>
              </View>
            )}
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
}
