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
};

export function useAlertsPalette() {
  const { config, activeTheme } = useAppConfig();

  return {
    ...config.modules.alerts,
    surface: activeTheme.surface,
    text: activeTheme.text,
    border: activeTheme.border,
    secondary: activeTheme.secondary,
    buttonText: activeTheme.buttonText,
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
      style={{
        flexGrow: 1,
        paddingHorizontal: horizontalPadding,
        paddingTop: 12,
        paddingBottom: bottomPadding,
        gap: 16,
      }}
    >
      {(showBackButton || title) && (
        <View
          style={{
            minHeight: 32,
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
          }}
        >
          {showBackButton && (
            <Pressable
              accessibilityRole="button"
              onPress={() => router.back()}
              style={{ paddingVertical: 4, paddingRight: 4 }}
            >
              <Ionicons name="chevron-back" size={20} color="#FFFFFF" />
            </Pressable>
          )}

          {!!title && (
            <Text
              style={{
                color: "#FFFFFF",
                fontSize: 15,
                fontFamily: AlertsFontFamily.bold,
              }}
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
  return (
    <View
      style={{
        alignSelf: "center",
        justifyContent: "center",
        alignItems: "center",
        width: size,
        height: size,
        borderRadius: size / 2,
        shadowColor: "#000000",
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
            <Stop offset="0" stopColor="#92272C" stopOpacity="1" />
            <Stop offset="1" stopColor="#79142A" stopOpacity="0.9" />
          </RadialGradient>
          <RadialGradient id="bg2" cx="75%" cy="42%" rx="40%" ry="40%">
            <Stop offset="0" stopColor="#BD6236" stopOpacity="0.85" />
            <Stop offset="1" stopColor="#BD6236" stopOpacity="0" />
          </RadialGradient>
          <RadialGradient id="bg3" cx="70%" cy="85%" rx="35%" ry="35%">
            <Stop offset="0" stopColor="#C5B099" stopOpacity="0.5" />
            <Stop offset="1" stopColor="#C5B099" stopOpacity="0" />
          </RadialGradient>
          <RadialGradient id="bg4" cx="25%" cy="88%" rx="35%" ry="35%">
            <Stop offset="0" stopColor="#C12B35" stopOpacity="0.45" />
            <Stop offset="1" stopColor="#C12B35" stopOpacity="0" />
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
            color="#FFFFFF"
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
    <View style={{ flex: 1, justifyContent: "center", gap: 28 }}>
      <AlertHeroIcon icon={icon} />

      <View
        style={{
          borderTopLeftRadius: 22,
          borderTopRightRadius: 22,
          borderBottomLeftRadius: 8,
          borderBottomRightRadius: 8,
          backgroundColor: palette.panelBackground,
          paddingHorizontal: 18,
          paddingTop: 18,
          paddingBottom: 14,
          gap: 12,
          minHeight: 188,
        }}
      >
        <Text
          style={{
            color: palette.text,
            fontSize: 28,
            fontWeight: "800",
          }}
        >
          {title}
        </Text>

        <Text
          style={{
            color: palette.panelText,
            fontSize: 13,
            lineHeight: 18,
          }}
        >
          {description}
        </Text>

        <View
          style={{
            marginTop: "auto",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <View style={{ flexDirection: "row", gap: 6 }}>
            {Array.from({ length: progressCount }).map((_, index) => (
              <View
                key={`${title}-${index}`}
                style={{
                  width: index === 1 ? 28 : 18,
                  height: 4,
                  borderRadius: 999,
                  backgroundColor: index === 1 ? "#FFFFFF" : "#E7D8C6",
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
              backgroundColor: "#FFFFFF",
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
  return (
    <View
      style={{
        flexDirection: "row",
        alignSelf: "center",
        gap: 6,
      }}
    >
      {Array.from({ length: total }).map((_, index) => (
        <View
          key={`page-${index}`}
          style={{
            width: index === activeIndex ? 22 : 8,
            height: 8,
            borderRadius: 999,
            backgroundColor:
              index === activeIndex ? "#FFFFFF" : "rgba(255,255,255,0.38)",
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
  return (
    <View
      style={[
        {
          backgroundColor: "#FFFFFF",
          borderTopLeftRadius: 22,
          borderTopRightRadius: 22,
          borderBottomLeftRadius: 6,
          borderBottomRightRadius: 6,
          padding: 16,
          gap: 12,
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
  titleColor = "#3A342F",
  descriptionColor = "#756C66",
}: AlertSeverityItemProps) {
  return (
    <View style={{ flexDirection: "row", alignItems: "flex-start", gap: 10 }}>
      <View
        style={{
          marginTop: 4,
          width: 10,
          height: 10,
          borderRadius: 999,
          backgroundColor: color,
        }}
      />
      <View style={{ flex: 1, gap: 2 }}>
        <Text style={{ color: titleColor, fontSize: 14, fontWeight: "700" }}>
          {title}
        </Text>
        <Text style={{ color: descriptionColor, fontSize: 11, lineHeight: 15 }}>
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
  return (
    <View
      style={{
        borderRadius: 16,
        backgroundColor,
        paddingHorizontal: 14,
        paddingVertical: 12,
        gap: 4,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Text
          style={{ color: textColor, fontSize: 14, fontWeight: "700", flex: 1 }}
        >
          {title}
        </Text>
        <Ionicons
          name="chevron-forward-circle-outline"
          size={18}
          color={textColor}
        />
      </View>
      <Text style={{ color: "#6D655E", fontSize: 11 }}>{date}</Text>
    </View>
  );
}

export function AlertNoticeCard({
  title,
  description,
  color,
  titleColor = "#433D38",
  descriptionColor = "#7A7067",
}: AlertNoticeCardProps) {
  return (
    <View style={{ flexDirection: "row", alignItems: "flex-start", gap: 10 }}>
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
        <MaterialCommunityIcons name="alert" size={12} color="#FFFFFF" />
      </View>

      <View style={{ flex: 1, gap: 3 }}>
        <Text style={{ color: titleColor, fontSize: 13, fontWeight: "700" }}>
          {title}
        </Text>
        <Text style={{ color: descriptionColor, fontSize: 11, lineHeight: 15 }}>
          {description}
        </Text>
      </View>
    </View>
  );
}

export function NotificationSwitch({
  value,
  onValueChange,
}: {
  value: boolean;
  onValueChange: (nextValue: boolean) => void;
}) {
  const palette = useAlertsPalette();

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
      }}
    >
      <Text style={{ color: "#433D38", fontSize: 13, fontWeight: "700" }}>
        Activar notificaciones
      </Text>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{
          false: palette.switchInactive,
          true: palette.switchActive,
        }}
        thumbColor="#FFFFFF"
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
      style={{
        borderRadius: 18,
        overflow: "hidden",
        borderWidth: 1,
        borderColor: "#E7DDD0",
      }}
    >
      <View
        style={{
          backgroundColor: palette.severity.emergency,
          paddingVertical: 8,
          paddingHorizontal: 12,
        }}
      >
        <Text
          style={{
            color: "#FFFFFF",
            textAlign: "center",
            fontSize: 12,
            fontWeight: "700",
          }}
        >
          Morená Nayarit
        </Text>
      </View>

      <View
        style={{
          height: cardHeight,
          backgroundColor: "#FFFFFF",
          padding: 14,
          gap: 10,
        }}
      >
        <Text style={{ color: "#534A43", fontSize: 11, lineHeight: 16 }}>
          Estatus: ACTIVA. Se desalojó la zona de riesgo y se mantienen brigadas
          por la posible lluvia intensa durante las próximas horas.
        </Text>

        <View
          style={{ alignItems: "center", justifyContent: "center", flex: 1 }}
        >
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
                  borderColor: "#FFFFFF",
                }}
              >
                <Ionicons name="warning" size={10} color="#FFFFFF" />
              </View>
            ))}
          </View>
        </View>

        <Text style={{ color: "#6E655D", fontSize: 11, lineHeight: 15 }}>
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
      style={{
        height: 146,
        borderRadius: 16,
        overflow: "hidden",
        backgroundColor: "#EDF3EA",
        position: "relative",
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
            borderColor: "#CFE0C9",
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
            borderColor: "#FFFFFF",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Ionicons name="location" size={10} color="#FFFFFF" />
        </View>
      ))}
    </View>
  );
}
