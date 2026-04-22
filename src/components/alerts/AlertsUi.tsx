import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Href, useRouter } from "expo-router";
import React from "react";
import {
  Pressable,
  ScrollView,
  Switch,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import Svg, { Circle, Defs, RadialGradient, Stop } from "react-native-svg";

import { useAppConfig } from "@/context/AppConfigContext";

export type AlertsIconName = keyof typeof MaterialCommunityIcons.glyphMap;

type AlertScreenScaffoldProps = {
  children: React.ReactNode;
  scroll?: boolean;
  showBackButton?: boolean;
  title?: string;
  includeTabsOffset?: boolean;
  backgroundColor?: string;
};

type AlertModuleCardProps = {
  icon: AlertsIconName;
  title: string;
  description: string;
  route?: Href;
  progressCount?: number;
};

type AlertSeverityItemProps = {
  color: string;
  title: string;
  description: string;
  titleColor?: string;
  descriptionColor?: string;
};

type AlertHistoryCardProps = {
  title: string;
  date: string;
  backgroundColor: string;
  textColor: string;
};

type AlertNoticeCardProps = {
  title: string;
  description: string;
  color: string;
  titleColor?: string;
  descriptionColor?: string;
  icon?: React.ReactNode;
};

export function useAlertsPalette() {
  const { config, activeTheme, resolvedColorMode } = useAppConfig();
  const alerts = config.modules.alerts[resolvedColorMode];

  return {
    background: activeTheme.background,
    primary: activeTheme.primary,
    surface: activeTheme.surface,
    text: activeTheme.text,
    textMuted: activeTheme.textMuted,
    border: activeTheme.border,
    secondary: activeTheme.secondary,
    buttonText: activeTheme.buttonText,
    ...alerts,
  };
}

export const AlertsFontFamily = {
  regular: "Ubuntu-Regular",
  medium: "Ubuntu-Medium",
  bold: "Ubuntu-Bold",
} as const;

export function AlertScreenScaffold({
  children,
  scroll = true,
  showBackButton = false,
  title,
  includeTabsOffset = false,
  backgroundColor,
}: AlertScreenScaffoldProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const palette = useAlertsPalette();
  const horizontalPadding = 20;
  const bottomPadding = includeTabsOffset
    ? insets.bottom + 102
    : Math.max(insets.bottom, 18);

  const resolvedBackgroundColor = backgroundColor ?? palette.shellBackground;

  const content = (
    <View
      className="flex-1 gap-4 px-5 pt-3"
      style={{
        flexGrow: 1,
        paddingHorizontal: horizontalPadding,
        paddingBottom: bottomPadding,
      }}
    >
      {(showBackButton || title) && (
        <View className="min-h-8 flex-row items-center gap-2">
          {showBackButton && (
            <Pressable
              accessibilityRole="button"
              onPress={() => router.back()}
              style={{ paddingVertical: 4, paddingRight: 4 }}
            >
              <Ionicons
                name="chevron-back"
                size={20}
                color={palette.buttonText}
              />
            </Pressable>
          )}

          {!!title && (
            <Text
              className="font-ubuntu-bold text-[15px]"
              style={{ color: palette.buttonText }}
            >
              {title}
            </Text>
          )}
        </View>
      )}

      {children}
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: resolvedBackgroundColor }}>
      {scroll ? (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1 }}
        >
          {content}
        </ScrollView>
      ) : (
        content
      )}
    </SafeAreaView>
  );
}

export function AlertHeroIcon({
  icon,
  size = 120,
  children,
}: {
  icon?: AlertsIconName;
  size?: number;
  children?: React.ReactNode;
}) {
  const palette = useAlertsPalette();

  return (
    <View
      className="self-center items-center justify-center overflow-hidden"
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        shadowColor: palette.shadowColor,
        shadowOpacity: 0.1,
        shadowRadius: 9,
        shadowOffset: { width: -9, height: 6 },
        elevation: 10,
        overflow: "hidden",
      }}
    >
      <Svg
        width={size}
        height={size}
        viewBox="0 0 270 270"
        style={{ position: "absolute" }}
      >
        <Defs>
          <RadialGradient id="bg1" cx="42%" cy="30%" rx="50%" ry="50%">
            <Stop offset="0" stopColor={palette.circleStart} stopOpacity="1" />
            <Stop offset="1" stopColor={palette.tileIcon} stopOpacity="0.9" />
          </RadialGradient>
          <RadialGradient id="bg2" cx="75%" cy="42%" rx="40%" ry="40%">
            <Stop offset="0" stopColor={palette.circleEnd} stopOpacity="0.85" />
            <Stop offset="1" stopColor={palette.circleEnd} stopOpacity="0" />
          </RadialGradient>
          <RadialGradient id="bg3" cx="70%" cy="85%" rx="35%" ry="35%">
            <Stop offset="0" stopColor={palette.circleGlow} stopOpacity="0.5" />
            <Stop offset="1" stopColor={palette.circleGlow} stopOpacity="0" />
          </RadialGradient>
          <RadialGradient id="bg4" cx="25%" cy="88%" rx="35%" ry="35%">
            <Stop
              offset="0"
              stopColor={palette.severity.emergency}
              stopOpacity="0.45"
            />
            <Stop
              offset="1"
              stopColor={palette.severity.emergency}
              stopOpacity="0"
            />
          </RadialGradient>
        </Defs>
        <Circle cx="135" cy="135" r="135" fill="url(#bg1)" />
        <Circle cx="135" cy="135" r="135" fill="url(#bg2)" />
        <Circle cx="135" cy="135" r="135" fill="url(#bg3)" />
        <Circle cx="135" cy="135" r="135" fill="url(#bg4)" />
      </Svg>
      {children ??
        (icon ? (
          <MaterialCommunityIcons
            name={icon}
            size={size * 0.48}
            color={palette.iconOnAccent}
          />
        ) : null)}
    </View>
  );
}

export function AlertModuleCard({
  icon,
  title,
  description,
  route,
  progressCount = 3,
}: AlertModuleCardProps) {
  const router = useRouter();
  const palette = useAlertsPalette();

  return (
    <View className="flex-1 justify-center gap-7">
      <AlertHeroIcon icon={icon} />

      <View
        className="min-h-[188px] gap-3 rounded-t-[22px] rounded-b-[8px] px-[18px] pt-[18px] pb-[14px]"
        style={{
          backgroundColor: palette.panelBackground,
        }}
      >
        <Text
          className="font-ubuntu-bold text-[28px]"
          style={{ color: palette.text }}
        >
          {title}
        </Text>

        <Text
          className="font-ubuntu-medium text-[13px] leading-[18px]"
          style={{ color: palette.panelText }}
        >
          {description}
        </Text>

        <View className="mt-auto flex-row items-center justify-between">
          <View className="flex-row gap-[6px]">
            {Array.from({ length: progressCount }).map((_, index) => (
              <View
                key={`${title}-${index}`}
                style={{
                  width: index === 1 ? 28 : 18,
                  height: 4,
                  borderRadius: 999,
                  backgroundColor:
                    index === 1
                      ? palette.progressActive
                      : palette.progressInactive,
                }}
              />
            ))}
          </View>

          <Pressable
            accessibilityRole={route ? "button" : undefined}
            disabled={!route}
            onPress={() => {
              if (route) {
                router.push(route);
              }
            }}
            style={({ pressed }) => ({
              width: 28,
              height: 28,
              borderRadius: 14,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: palette.surface,
              opacity: pressed ? 0.82 : 1,
            })}
          >
            <Ionicons
              name="arrow-forward"
              size={16}
              color={palette.secondary}
            />
          </Pressable>
        </View>
      </View>
    </View>
  );
}

export function AlertPager({
  total,
  activeIndex,
}: {
  total: number;
  activeIndex: number;
}) {
  const palette = useAlertsPalette();

  return (
    <View className="self-center flex-row gap-[6px]">
      {Array.from({ length: total }).map((_, index) => (
        <View
          key={`page-${index}`}
          style={{
            width: index === activeIndex ? 22 : 8,
            height: 8,
            borderRadius: 999,
            backgroundColor:
              index === activeIndex
                ? palette.progressActive
                : palette.progressInactive,
          }}
        />
      ))}
    </View>
  );
}

export function DetailCard({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: object;
}) {
  const palette = useAlertsPalette();

  return (
    <View
      style={[
        {
          backgroundColor: palette.cardBackground,
          borderTopLeftRadius: 22,
          borderTopRightRadius: 22,
          borderBottomLeftRadius: 6,
          borderBottomRightRadius: 6,
          padding: 16,
          gap: 12,
          borderWidth: 1,
          borderColor: palette.cardBorder,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

export function AlertSeverityItem({
  color,
  title,
  description,
  titleColor,
  descriptionColor,
}: AlertSeverityItemProps) {
  const palette = useAlertsPalette();

  return (
    <View className="flex-row items-start gap-2.5">
      <View
        style={{
          marginTop: 4,
          width: 10,
          height: 10,
          borderRadius: 999,
          backgroundColor: color,
        }}
      />
      <View className="flex-1 gap-0.5">
        <Text
          className="font-ubuntu-bold text-[14px]"
          style={{ color: titleColor ?? palette.text }}
        >
          {title}
        </Text>
        <Text
          className="font-ubuntu-medium text-[11px] leading-[15px]"
          style={{ color: descriptionColor ?? palette.subtleText }}
        >
          {description}
        </Text>
      </View>
    </View>
  );
}

export function AlertHistoryCard({
  title,
  date,
  backgroundColor,
  textColor,
}: AlertHistoryCardProps) {
  const palette = useAlertsPalette();

  return (
    <View
      className="gap-1 rounded-2xl px-[14px] py-3"
      style={{
        backgroundColor,
      }}
    >
      <View className="flex-row items-center justify-between">
        <Text
          className="flex-1 font-ubuntu-bold text-[14px]"
          style={{ color: textColor }}
        >
          {title}
        </Text>
        <Ionicons
          name="chevron-forward-circle-outline"
          size={18}
          color={textColor}
        />
      </View>
      <Text
        className="font-ubuntu-medium text-[11px]"
        style={{ color: palette.subtleText }}
      >
        {date}
      </Text>
    </View>
  );
}

export function AlertNoticeCard({
  title,
  description,
  color,
  titleColor,
  descriptionColor,
  icon,
}: AlertNoticeCardProps) {
  const palette = useAlertsPalette();

  return (
    <View className="flex-row items-start gap-2.5">
      {icon ? (
        <View style={{ marginTop: 2 }}>{icon}</View>
      ) : (
        <View
          style={{
            marginTop: 2,
            width: 20,
            height: 20,
            borderRadius: 999,
            backgroundColor: color,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <MaterialCommunityIcons
            name="alert"
            size={12}
            color={palette.iconOnAccent}
          />
        </View>
      )}

      <View className="flex-1 gap-[3px]">
        <Text
          className="font-ubuntu-bold text-[13px]"
          style={{ color: titleColor ?? palette.text }}
        >
          {title}
        </Text>
        <Text
          className="font-ubuntu-medium text-[11px] leading-[15px]"
          style={{ color: descriptionColor ?? palette.subtleText }}
        >
          {description}
        </Text>
      </View>
    </View>
  );
}

export function NotificationSwitch({
  value,
  onValueChange,
  disabled = false,
}: {
  value: boolean;
  onValueChange: (nextValue: boolean) => void;
  disabled?: boolean;
}) {
  const palette = useAlertsPalette();

  return (
    <View className="flex-row items-center justify-between gap-3">
      <Text
        className="font-ubuntu-bold text-[13px]"
        style={{ color: palette.text }}
      >
        Activar notificaciones
      </Text>
      <Switch
        value={value}
        onValueChange={onValueChange}
        disabled={disabled}
        trackColor={{
          false: palette.switchInactive,
          true: palette.switchActive,
        }}
        thumbColor={palette.iconOnAccent}
        ios_backgroundColor={palette.switchInactive}
      />
    </View>
  );
}

export function RegionMapCard({ compact = false }: { compact?: boolean }) {
  const palette = useAlertsPalette();
  const cardHeight = compact ? 168 : 222;

  return (
    <View
      className="overflow-hidden rounded-[18px] border"
      style={{
        borderColor: palette.cardBorder,
      }}
    >
      <View
        className="px-3 py-2"
        style={{
          backgroundColor: palette.severity.emergency,
        }}
      >
        <Text className="text-center font-ubuntu-bold text-[12px] text-white">
          Morená Nayarit
        </Text>
      </View>

      <View
        className="gap-2.5 p-[14px]"
        style={{
          height: cardHeight,
          backgroundColor: palette.cardBackground,
        }}
      >
        <Text
          className="font-ubuntu-medium text-[11px] leading-[16px]"
          style={{ color: palette.text }}
        >
          Estatus: ACTIVA. Se desalojó la zona de riesgo y se mantienen brigadas
          por la posible lluvia intensa durante las próximas horas.
        </Text>

        <View className="flex-1 items-center justify-center">
          <View
            style={{
              width: compact ? 160 : 188,
              height: compact ? 108 : 132,
              position: "relative",
            }}
          >
            <View
              style={{
                position: "absolute",
                top: 18,
                left: 18,
                width: compact ? 58 : 64,
                height: compact ? 48 : 58,
                borderRadius: 16,
                backgroundColor: palette.map.primary,
                transform: [{ rotate: "-18deg" }],
              }}
            />
            <View
              style={{
                position: "absolute",
                top: 10,
                left: 64,
                width: compact ? 54 : 62,
                height: compact ? 72 : 84,
                borderRadius: 18,
                backgroundColor: palette.map.secondary,
                transform: [{ rotate: "8deg" }],
              }}
            />
            <View
              style={{
                position: "absolute",
                top: 42,
                left: 100,
                width: compact ? 50 : 60,
                height: compact ? 56 : 68,
                borderRadius: 18,
                backgroundColor: palette.map.primary,
                transform: [{ rotate: "22deg" }],
              }}
            />
            <View
              style={{
                position: "absolute",
                top: 64,
                left: 34,
                width: compact ? 72 : 84,
                height: compact ? 42 : 54,
                borderRadius: 18,
                backgroundColor: palette.map.secondary,
                transform: [{ rotate: "-6deg" }],
              }}
            />
            {[
              { top: 34, left: 62 },
              { top: 64, left: 92 },
              { top: 78, left: 48 },
            ].map((marker, index) => (
              <View
                key={`marker-${index}`}
                style={{
                  position: "absolute",
                  top: marker.top,
                  left: marker.left,
                  width: 20,
                  height: 20,
                  borderRadius: 999,
                  backgroundColor: palette.map.marker,
                  justifyContent: "center",
                  alignItems: "center",
                  borderWidth: 2,
                  borderColor: palette.cardBackground,
                }}
              >
                <Ionicons
                  name="warning"
                  size={10}
                  color={palette.iconOnAccent}
                />
              </View>
            ))}
          </View>
        </View>

        <Text
          className="font-ubuntu-medium text-[11px] leading-[15px]"
          style={{ color: palette.subtleText }}
        >
          Zonas afectadas: Mpio. Santiago Ixcuintla, San Blas y Compostela.
        </Text>
      </View>
    </View>
  );
}

export function IncidentMapPreview() {
  const { width } = useWindowDimensions();
  const palette = useAlertsPalette();
  const mapWidth = width - 72;

  return (
    <View
      className="relative h-[146px] overflow-hidden rounded-2xl"
      style={{
        backgroundColor: palette.mapBackground,
      }}
    >
      {[
        { top: 16, left: 22, width: mapWidth * 0.52, height: 28 },
        { top: 48, left: 40, width: mapWidth * 0.44, height: 22 },
        { top: 82, left: 18, width: mapWidth * 0.6, height: 30 },
      ].map((segment, index) => (
        <View
          key={`road-${index}`}
          style={{
            position: "absolute",
            top: segment.top,
            left: segment.left,
            width: segment.width,
            height: segment.height,
            borderRadius: 999,
            borderWidth: 8,
            borderColor: palette.mapRoad,
            transform: [{ rotate: index === 1 ? "-10deg" : "8deg" }],
          }}
        />
      ))}

      {[
        { top: 46, left: 108 },
        { top: 76, left: 150 },
      ].map((pin, index) => (
        <View
          key={`pin-${index}`}
          style={{
            position: "absolute",
            top: pin.top,
            left: pin.left,
            width: 20,
            height: 20,
            borderRadius: 999,
            backgroundColor: palette.map.marker,
            borderWidth: 2,
            borderColor: palette.cardBackground,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Ionicons name="location" size={10} color={palette.iconOnAccent} />
        </View>
      ))}
    </View>
  );
}
