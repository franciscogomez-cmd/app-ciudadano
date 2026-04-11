import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

import { useAlertsPalette } from "@/components/alerts/AlertsUi";
import { AlertaMeteorologicaIcon } from "@/components/icons";
import { useAppConfig } from "@/context/AppConfigContext";

type HistoryItem = {
  title: string;
  updatedAt: string;
  status: string;
  accentColor: string;
  icon: React.ReactNode;
};

function HistoryBadgeIcon({
  icon,
}: {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
}) {
  const palette = useAlertsPalette();

  return (
    <View
      className="h-[42px] w-[42px] items-center justify-center rounded-full"
      style={{ backgroundColor: palette.historyBadgeOuter }}
    >
      <View
        className="h-8 w-8 items-center justify-center rounded-full"
        style={{ backgroundColor: palette.severity.emergency }}
      >
        <MaterialCommunityIcons
          name={icon}
          size={17}
          color={palette.iconOnAccent}
        />
      </View>
    </View>
  );
}

function HistoryListCard({
  title,
  updatedAt,
  status,
  accentColor,
  icon,
}: HistoryItem) {
  const palette = useAlertsPalette();

  return (
    <View
      className="overflow-hidden rounded-[26px] border"
      style={{
        backgroundColor: palette.cardBackground,
        borderColor: palette.cardBorder,
        shadowColor: palette.shadowAccent,
        shadowOpacity: 0.12,
        shadowRadius: 14,
        shadowOffset: { width: 0, height: 7 },
        elevation: 4,
      }}
    >
      <View
        className="items-center px-4 py-[10px]"
        style={{ backgroundColor: accentColor }}
      >
        <Text className="font-ubuntu-bold text-[15px] leading-[18px] text-white">
          {title}
        </Text>
      </View>

      <View className="flex-row items-center gap-[14px] px-4 py-4">
        {icon}

        <View className="flex-1 gap-[3px]">
          <Text
            className="font-ubuntu-medium text-[13px] leading-[16px]"
            style={{ color: palette.subtleText }}
          >
            Ultima actualizacion:
          </Text>
          <Text
            className="font-ubuntu-medium text-[14px] leading-[18px]"
            style={{ color: palette.subtleText }}
          >
            {updatedAt}
          </Text>
          <Text
            className="font-ubuntu-bold text-[15px] leading-[18px]"
            style={{ color: palette.text }}
          >
            Estatus: {status}
          </Text>
        </View>

        <Ionicons
          name="add-circle-outline"
          size={34}
          color={palette.historyActionIcon}
        />
      </View>
    </View>
  );
}

export function AlertHistoryPage() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const palette = useAlertsPalette();
  const { activeTheme } = useAppConfig();
  const historyItems: HistoryItem[] = [
    {
      title: "Cierre vial por inundacion",
      updatedAt: "5 de marzo 2026 12:30 a.m.",
      status: "ACTIVA",
      accentColor: palette.severity.preventive,
      icon: (
        <AlertaMeteorologicaIcon
          size={42}
          fillColor={palette.severity.emergency}
          strokeColor={palette.iconOnAccent}
        />
      ),
    },
    {
      title: "Mantenimiento Vial",
      updatedAt: "2 de marzo 2026 08:30 a.m.",
      status: "Finalizada",
      accentColor: palette.severity.preventive,
      icon: <HistoryBadgeIcon icon="bullhorn-outline" />,
    },
    {
      title: "Corte de agua programado",
      updatedAt: "2 de marzo 2026 08:30 a.m.",
      status: "Finalizada",
      accentColor: palette.severity.informative,
      icon: <HistoryBadgeIcon icon="bullhorn-outline" />,
    },
  ];

  return (
    <SafeAreaView
      edges={["top"]}
      className="flex-1"
      style={{ backgroundColor: palette.shellBackground }}
    >
      <StatusBar style={activeTheme.statusBarStyle} />
      <View
        className="flex-1"
        // style={{ backgroundColor: palette.contentBackground }}
      >
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
            {historyItems.map((item) => (
              <HistoryListCard key={item.title} {...item} />
            ))}
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
}
