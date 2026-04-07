import { Href, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useMemo, useRef, useState } from "react";
import {
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Circle, Path } from "react-native-svg";

import {
  AlertHeroIcon,
  AlertNoticeCard,
  AlertSeverityItem,
  AlertsFontFamily,
  useAlertsPalette,
} from "@/components/alerts/AlertsUi";
import {
  ActivaNotificacionesIcon,
  AlertasIcon,
  GpsIcon,
  HistorialAlertasIcon,
  NivelesSeguridadIcon,
  NotificacionesIcon,
} from "@/components/icons";

type OnboardingSlide = {
  renderIcon: (size: number) => React.ReactNode;
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
  return (
    <View
      style={{
        height: 7,
        borderRadius: 13,
        backgroundColor: "#D6CCBF",
      }}
    >
      <View
        style={{
          position: "absolute",
          left: 0,
          width: `${((activeIndex + 1) / total) * 100}%`,
          height: 7,
          borderRadius: 13,
          backgroundColor: "#FFFFFF",
        }}
      />
    </View>
  );
}

function OnboardingArrowButton({
  direction,
  hidden,
  onPress,
}: {
  direction: "back" | "forward";
  hidden?: boolean;
  onPress: () => void;
}) {
  if (hidden) {
    return <View style={{ width: 26, height: 26 }} />;
  }

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => ({
        width: 26,
        height: 26,
        opacity: pressed ? 0.7 : 1,
      })}
    >
      <Svg width={26} height={26} viewBox="0 0 26 26" fill="none">
        <Circle cx={13} cy={13} r={13} fill="white" />
        {direction === "forward" ? (
          <>
            <Path
              d="M7.1665 13H18.8332"
              stroke="#C5B099"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <Path
              d="M13 7.1665L18.8333 12.9998L13 18.8332"
              stroke="#C5B099"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </>
        ) : (
          <>
            <Path
              d="M18.8335 13L7.16683 13"
              stroke="#C5B099"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <Path
              d="M13 18.8335L7.16667 13.0002L13 7.16683"
              stroke="#C5B099"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </>
        )}
      </Svg>
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
  const heroSize = Math.min(width * 0.65, 300);

  const iconSize = heroSize * 0.64;

  const slides = useMemo<OnboardingSlide[]>(
    () => [
      {
        renderIcon: (s: number) => <AlertasIcon size={s} />,
        title: "Alertas",
        body: (
          <Text
            style={{
              color: "#FFFFFF",
              fontFamily: AlertsFontFamily.medium,
              fontSize: 14,
              lineHeight: 20,
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
        renderIcon: (s: number) => <NivelesSeguridadIcon size={s} />,
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
        renderIcon: (s: number) => <GpsIcon size={s} />,
        title: "GPS",
        body: (
          <Text
            style={{
              color: "#FFFFFF",
              fontFamily: AlertsFontFamily.medium,
              fontSize: 14,
              lineHeight: 20,
            }}
          >
            Para recibir alertas, ingresa tu codigo postal o activa tu GPS.
          </Text>
        ),
      },
      {
        renderIcon: (s: number) => <NotificacionesIcon size={s} />,
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
        renderIcon: (s: number) => <ActivaNotificacionesIcon size={s} />,
        title: "Activa notificaciones",
        body: (
          <Text
            style={{
              color: "#FFFFFF",
              fontFamily: AlertsFontFamily.medium,
              fontSize: 14,
              lineHeight: 20,
            }}
          >
            Activa las notificaciones para recibir alertas cuando ocurra una
            situacion relevante cerca de tu ubicacion.
          </Text>
        ),
      },
      {
        renderIcon: (s: number) => <HistorialAlertasIcon size={s} />,
        title: "Historial de alertas",
        route: "/alertas",
        ctaLabel: "Iniciar",
        body: (
          <Text
            style={{
              color: "#FFFFFF",
              fontFamily: AlertsFontFamily.medium,
              fontSize: 14,
              lineHeight: 20,
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
                <AlertHeroIcon size={heroSize}>
                  {item.renderIcon(iconSize)}
                </AlertHeroIcon>
              </View>

              <View
                style={{
                  width: slideWidth,
                  backgroundColor: "#C5B099",
                  borderTopLeftRadius: 52,
                  borderTopRightRadius: 52,
                  paddingHorizontal: 24,
                  paddingTop: 32,
                  paddingBottom: Math.max(insets.bottom, 16),
                }}
              >
                <Text
                  style={{
                    color: "#60595D",
                    fontFamily: AlertsFontFamily.bold,
                    fontSize: 30,
                    lineHeight: 28,
                    marginBottom: 40,
                  }}
                >
                  {item.title}
                </Text>

                <View style={{ marginBottom: 40 }}>{item.body}</View>

                {item.ctaLabel ? (
                  <TouchableOpacity
                    accessibilityRole="button"
                    activeOpacity={0.85}
                    onPress={() => router.replace(item.route ?? "/alertas")}
                    style={{
                      width: "100%",
                      borderRadius: 8,
                      backgroundColor: "#2D2B27",
                      justifyContent: "center",
                      alignItems: "center",
                      paddingVertical: 14,
                      paddingHorizontal: 12,
                      marginBottom: 24,
                      overflow: "hidden",
                    }}
                  >
                    <Text
                      style={{
                        color: "#FFFFFF",
                        fontFamily: AlertsFontFamily.bold,
                        fontSize: 14,
                        lineHeight: 18,
                      }}
                    >
                      {item.ctaLabel}
                    </Text>
                  </TouchableOpacity>
                ) : null}

                <OnboardingProgress
                  total={slides.length}
                  activeIndex={activeIndex}
                />

                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginTop: 20,
                  }}
                >
                  <OnboardingArrowButton
                    direction="back"
                    hidden={index === 0}
                    onPress={() => {
                      if (index > 0) {
                        goToIndex(index - 1);
                      }
                    }}
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
