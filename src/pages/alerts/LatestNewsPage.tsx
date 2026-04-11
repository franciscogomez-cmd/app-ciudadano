import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import {
    SafeAreaView,
    useSafeAreaInsets,
} from "react-native-safe-area-context";

import { useAlertsPalette } from "@/components/alerts/AlertsUi";
import { useAppConfig } from "@/context/AppConfigContext";

function NewsHeadlineCard() {
  const palette = useAlertsPalette();

  return (
    <View
      className="overflow-hidden rounded-[20px] border"
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
      <View
        className="items-center px-4 py-[10px]"
        style={{ backgroundColor: palette.severity.emergency }}
      >
        <Text
          className="font-ubuntu-bold text-[16px] leading-[18px]"
          style={{ color: palette.severityText.emergency }}
        >
          Huracan Marcela
        </Text>
      </View>

      <View className="gap-[10px] px-4 pt-[10px] pb-[14px]">
        <Text
          className="text-right font-ubuntu-medium text-[12px] leading-[16px]"
          style={{ color: palette.subtleText }}
        >
          5 de abril 2026 10:30 a.m.
        </Text>

        <Text
          className="font-ubuntu-medium text-[14px] leading-[18px]"
          style={{ color: palette.text }}
        >
          Estatus: <Text className="font-ubuntu-bold">ACTIVA</Text>
        </Text>

        <Text
          className="font-ubuntu-bold text-[15px] leading-[20px]"
          style={{ color: palette.text }}
        >
          Se esperan vientos huracanados por tu zona debido a la llegada del
          huracan Marcela a las costas nayaritas.
        </Text>
      </View>
    </View>
  );
}

function AffectedZonesCard() {
  const palette = useAlertsPalette();

  return (
    <View
      className="rounded-[18px] border px-[14px] py-[12px]"
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
        className="font-ubuntu-medium text-[13px] leading-[19px]"
        style={{ color: palette.text }}
      >
        Zonas afectadas: Mpio. Santiago Ixcuintla, Mpio. San Blas y Compostela y
        Mpio Bahia de Banderas.
      </Text>
    </View>
  );
}

export function LatestNewsPage() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const palette = useAlertsPalette();
  const { activeTheme } = useAppConfig();

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
          <ScrollView
            style={{ flex: 1, backgroundColor: palette.cardBackground }}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingTop: 26,
              paddingHorizontal: 22,
              paddingBottom: Math.max(insets.bottom + 34, 42),
              gap: 16,
              flexGrow: 1,
            }}
          >
            <NewsHeadlineCard />
            <AffectedZonesCard />
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
}
