import { Ionicons } from "@expo/vector-icons";
import { Href, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useMemo, useRef, useState } from "react";
import {
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  ScrollView,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import {
  AlertHeroIcon,
  AlertNoticeCard,
  AlertSeverityItem,
  AlertsFontFamily,
  AlertsIconName,
  useAlertsPalette,
} from "@/components/alerts/AlertsUi";

type OnboardingSlide = {
  icon: AlertsIconName;
  title: string;
  route?: Href;
  body: React.ReactNode;
  ctaLabel?: string;
};

function OnboardingProgress({
  total,
  activeIndex,
}: {
  total: number;
  activeIndex: number;
}) {
  const palette = useAlertsPalette();

  return (
    <View
      style={{ flexDirection: "row", flex: 1, gap: 6, marginHorizontal: 14 }}
    >
      {Array.from({ length: total }).map((_, index) => (
        <View
          key={`onboarding-progress-${index}`}
          style={{
            flex: 1,
            height: 6,
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

function OnboardingArrowButton({
  direction,
  disabled,
  onPress,
}: {
  direction: "back" | "forward";
  disabled?: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => ({
        width: 38,
        height: 38,
        borderRadius: 19,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#FFFFFF",
        opacity: disabled ? 0.35 : pressed ? 0.82 : 1,
      })}
    >
      <Ionicons
        name={direction === "back" ? "arrow-back" : "arrow-forward"}
        size={22}
        color="#A88B69"
      />
    </Pressable>
  );
}

export function OnboardingPage() {
  const router = useRouter();
  const palette = useAlertsPalette();
  const listRef = useRef<FlatList<OnboardingSlide> | null>(null);
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const [activeIndex, setActiveIndex] = useState(0);
  const slideWidth = width;
  const heroSize = Math.min(width * 0.55, 280);

  const slides = useMemo<OnboardingSlide[]>(
    () => [
      {
        icon: "alarm-light-outline",
        title: "Alertas",
        body: (
          <Text
            style={{
              color: "#FFFFFF",
              fontFamily: AlertsFontFamily.medium,
              fontSize: 14,
              lineHeight: 16,
            }}
          >
            Mantente informado sobre riesgos o emergencias cerca de tu ubicacion
            y recibe alertas en tiempo real en tu dispositivo.{"\n\n"}Las
            alertas se envian segun tu ubicacion. Solo recibiras notificaciones
            cuando ocurra un evento relevante cerca de ti.
          </Text>
        ),
      },
      {
        icon: "chart-bar",
        title: "Niveles de seguridad",
        body: (
          <View style={{ gap: 10 }}>
            <AlertSeverityItem
              color={palette.severity.preventive}
              title="Preventiva"
              description="Situaciones que requieren precaucion y pueden representar un riesgo."
              titleColor="#FFFFFF"
              descriptionColor="#FFFFFF"
            />
            <AlertSeverityItem
              color={palette.severity.emergency}
              title="Emergencia"
              description="Situaciones de alto riesgo que requieren atencion inmediata."
              titleColor="#FFFFFF"
              descriptionColor="#FFFFFF"
            />
            <AlertSeverityItem
              color={palette.severity.informative}
              title="Informativa"
              description="Avisos relevantes para la ciudadania."
              titleColor="#FFFFFF"
              descriptionColor="#FFFFFF"
            />
          </View>
        ),
      },
      {
        icon: "map-marker-outline",
        title: "GPS",
        body: (
          <Text
            style={{
              color: "#FFFFFF",
              fontFamily: AlertsFontFamily.medium,
              fontSize: 14,
              lineHeight: 16,
            }}
          >
            Para recibir alertas, ingresa tu codigo postal o activa tu GPS.
          </Text>
        ),
      },
      {
        icon: "bell-badge-outline",
        title: "Notificaciones",
        body: (
          <View style={{ gap: 14 }}>
            <AlertNoticeCard
              color={palette.severity.emergency}
              title="Alertas meteorologicas"
              description="Recibe notificaciones sobre fenomenos meteorologicos que puedan afectar tu zona."
              titleColor="#FFFFFF"
              descriptionColor="#FFFFFF"
            />
            <AlertNoticeCard
              color={palette.severity.emergency}
              title="Noticias de ultima hora"
              description="Recibe avisos sobre eventos o situaciones importantes que puedan impactar tu localidad."
              titleColor="#FFFFFF"
              descriptionColor="#FFFFFF"
            />
          </View>
        ),
      },
      {
        icon: "bell-ring-outline",
        title: "Activa notificaciones",
        body: (
          <Text
            style={{
              color: "#FFFFFF",
              fontFamily: AlertsFontFamily.medium,
              fontSize: 14,
              lineHeight: 16,
            }}
          >
            Activa las notificaciones para recibir alertas cuando ocurra una
            situacion relevante cerca de tu ubicacion.
          </Text>
        ),
      },
      {
        icon: "file-clock-outline",
        title: "Historial de alertas",
        route: "/alertas",
        ctaLabel: "Iniciar",
        body: (
          <Text
            style={{
              color: "#FFFFFF",
              fontFamily: AlertsFontFamily.medium,
              fontSize: 14,
              lineHeight: 16,
            }}
          >
            Activa las notificaciones para recibir alertas cuando ocurra una
            situacion relevante cerca de tu ubicacion.
          </Text>
        ),
      },
    ],
    [palette],
  );

  const goToIndex = (nextIndex: number) => {
    listRef.current?.scrollToIndex({ index: nextIndex, animated: true });
    setActiveIndex(nextIndex);
  };

  const handleMomentumEnd = (
    event: NativeSyntheticEvent<NativeScrollEvent>,
  ) => {
    const nextIndex = Math.round(
      event.nativeEvent.contentOffset.x / slideWidth,
    );
    setActiveIndex(Math.max(0, Math.min(nextIndex, slides.length - 1)));
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <StatusBar style="dark" />

      <FlatList
        ref={listRef}
        data={slides}
        horizontal
        pagingEnabled
        bounces={false}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.title}
        onMomentumScrollEnd={handleMomentumEnd}
        renderItem={({ item, index }) => {
          const panelHeight = height * 0.42;
          const navBarHeight = 52;
          const titleHeight = 44;
          const ctaHeight = item.ctaLabel ? 52 : 0;
          const panelPaddingV = 28 + Math.max(insets.bottom, 16);
          const gapTotal = 12 * (item.ctaLabel ? 3 : 2);
          const bodyMaxHeight =
            panelHeight -
            panelPaddingV -
            titleHeight -
            navBarHeight -
            ctaHeight -
            gapTotal;

          return (
            <View
              style={{
                width: slideWidth,
                height: height,
                backgroundColor: "#FFFFFF",
              }}
            >
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  paddingTop: insets.top,
                }}
              >
                <AlertHeroIcon icon={item.icon} size={heroSize} />
              </View>

              <View
                style={{
                  width: slideWidth,
                  height: panelHeight,
                  backgroundColor: palette.panelBackground,
                  borderTopLeftRadius: 52,
                  borderTopRightRadius: 52,
                  paddingHorizontal: 24,
                  paddingTop: 28,
                  paddingBottom: Math.max(insets.bottom, 16),
                  gap: 12,
                }}
              >
                <Text
                  style={{
                    color: palette.panelText,
                    fontFamily: AlertsFontFamily.bold,
                    fontSize: 30,
                    lineHeight: 36,
                  }}
                >
                  {item.title}
                </Text>

                <ScrollView
                  style={{ maxHeight: bodyMaxHeight }}
                  showsVerticalScrollIndicator={false}
                >
                  {item.body}
                </ScrollView>

                {item.ctaLabel ? (
                  <Pressable
                    accessibilityRole="button"
                    onPress={() => router.replace(item.route ?? "/alertas")}
                    style={({ pressed }) => ({
                      minHeight: 32,
                      borderRadius: 10,
                      backgroundColor: palette.actionBackground,
                      justifyContent: "center",
                      alignItems: "center",
                      opacity: pressed ? 0.88 : 1,
                      paddingVertical: 8,
                    })}
                  >
                    <Text
                      style={{
                        color: palette.actionText,
                        fontFamily: AlertsFontFamily.bold,
                        fontSize: 15,
                      }}
                    >
                      {item.ctaLabel}
                    </Text>
                  </Pressable>
                ) : null}

                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginTop: "auto",
                  }}
                >
                  <OnboardingArrowButton
                    direction="back"
                    disabled={index === 0}
                    onPress={() => {
                      if (index > 0) {
                        goToIndex(index - 1);
                      }
                    }}
                  />

                  <OnboardingProgress
                    total={slides.length}
                    activeIndex={activeIndex}
                  />

                  <OnboardingArrowButton
                    direction="forward"
                    onPress={() => {
                      if (index === slides.length - 1) {
                        router.replace("/alertas");
                        return;
                      }

                      goToIndex(index + 1);
                    }}
                  />
                </View>
              </View>
            </View>
          );
        }}
      />
    </View>
  );
}
