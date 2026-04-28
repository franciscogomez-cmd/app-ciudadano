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
    useAlertsPalette,
} from "@/components/alerts/AlertsUi";
import {
    ActivaNotificacionesIcon,
    AlertaMeteorologicaIcon,
    AlertasIcon,
    GpsIcon,
    HistorialAlertasIcon,
    NivelesSeguridadIcon,
    NoticiasUltimaHoraIcon,
    NotificacionesIcon,
} from "@/components/icons";
import { useAppConfig } from "@/context/AppConfigContext";

type OnboardingSlide = {
  renderIcon: (size: number) => React.ReactNode;
  title: string;
  route?: Href;
  body: React.ReactNode;
  ctaLabel?: string;
};

function OnboardingCopy({ children }: { children: React.ReactNode }) {
  const palette = useAlertsPalette();

  return (
    <Text
      className="font-ubuntu-medium text-[14px] leading-[20px]"
      style={{ color: palette.buttonText }}
    >
      {children}
    </Text>
  );
}

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
      className="h-[7px] rounded-[13px]"
      style={{ backgroundColor: palette.progressInactive }}
    >
      <View
        className="absolute left-0 h-[7px] rounded-[13px]"
        style={{
          width: `${((activeIndex + 1) / total) * 100}%`,
          backgroundColor: palette.progressActive,
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
  const palette = useAlertsPalette();

  if (hidden) {
    return <View className="h-[38px] w-[38px]" />;
  }

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      className="h-[38px] w-[38px]"
      style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
    >
      <Svg width={38} height={38} viewBox="0 0 26 26" fill="none">
        <Circle cx={13} cy={13} r={13} fill={palette.progressActive} />
        {direction === "forward" ? (
          <>
            <Path
              d="M7.1665 13H18.8332"
              stroke={palette.panelBackground}
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <Path
              d="M13 7.1665L18.8333 12.9998L13 18.8332"
              stroke={palette.panelBackground}
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </>
        ) : (
          <>
            <Path
              d="M18.8335 13L7.16683 13"
              stroke={palette.panelBackground}
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <Path
              d="M13 18.8335L7.16667 13.0002L13 7.16683"
              stroke={palette.panelBackground}
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
  const { activeTheme } = useAppConfig();
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
        renderIcon: (s: number) => (
          <AlertasIcon size={s} color={palette.buttonText} />
        ),
        title: "Alertas",
        body: (
          <OnboardingCopy>
            Mantente informado sobre riesgos o emergencias cerca de tu ubicacion
            y recibe alertas en tiempo real en tu dispositivo.{"\n\n"}Las
            alertas se envian segun tu ubicacion. Solo recibiras notificaciones
            cuando ocurra un evento relevante cerca de ti.
          </OnboardingCopy>
        ),
      },
      {
        renderIcon: (s: number) => (
          <NivelesSeguridadIcon size={s} color={palette.buttonText} />
        ),
        title: "Niveles de seguridad",
        body: (
          <View className="gap-2.5">
            <AlertSeverityItem
              color={palette.severity.preventive}
              title="Preventiva"
              description="Situaciones que requieren precaucion y pueden representar un riesgo."
              titleColor={palette.buttonText}
              descriptionColor={palette.buttonText}
            />
            <AlertSeverityItem
              color={palette.severity.emergency}
              title="Emergencia"
              description="Situaciones de alto riesgo que requieren atencion inmediata."
              titleColor={palette.buttonText}
              descriptionColor={palette.buttonText}
            />
            <AlertSeverityItem
              color={palette.severity.informative}
              title="Informativa"
              description="Avisos relevantes para la ciudadania."
              titleColor={palette.buttonText}
              descriptionColor={palette.buttonText}
            />
          </View>
        ),
      },
      {
        renderIcon: (s: number) => (
          <GpsIcon size={s} color={palette.buttonText} />
        ),
        title: "GPS",
        body: (
          <OnboardingCopy>
            Para recibir alertas, ingresa tu codigo postal o activa tu GPS.
          </OnboardingCopy>
        ),
      },
      {
        renderIcon: (s: number) => (
          <NotificacionesIcon size={s} color={palette.buttonText} />
        ),
        title: "Notificaciones",
        body: (
          <View className="gap-[14px]">
            <AlertNoticeCard
              color={palette.severity.emergency}
              icon={
                <AlertaMeteorologicaIcon
                  fillColor={palette.severity.emergency}
                  strokeColor={palette.iconOnAccent}
                />
              }
              title="Alertas meteorologicas"
              description="Recibe notificaciones sobre fenomenos meteorologicos que puedan afectar tu zona."
              titleColor={palette.buttonText}
              descriptionColor={palette.buttonText}
            />
            <AlertNoticeCard
              color={palette.severity.emergency}
              icon={
                <NoticiasUltimaHoraIcon
                  fillColor={palette.severity.emergency}
                  strokeColor={palette.iconOnAccent}
                />
              }
              title="Noticias de ultima hora"
              description="Recibe avisos sobre eventos o situaciones importantes que puedan impactar tu localidad."
              titleColor={palette.buttonText}
              descriptionColor={palette.buttonText}
            />
          </View>
        ),
      },
      {
        renderIcon: (s: number) => (
          <ActivaNotificacionesIcon size={s} color={palette.buttonText} />
        ),
        title: "Activa notificaciones",
        body: (
          <OnboardingCopy>
            Activa las notificaciones para recibir alertas cuando ocurra una
            situacion relevante cerca de tu ubicacion.
          </OnboardingCopy>
        ),
      },
      {
        renderIcon: (s: number) => (
          <HistorialAlertasIcon size={s} color={palette.buttonText} />
        ),
        title: "Historial de alertas",
        route: "/alertas",
        ctaLabel: "Iniciar",
        body: (
          <OnboardingCopy>
            Activa las notificaciones para recibir alertas cuando ocurra una
            situacion relevante cerca de tu ubicacion.
          </OnboardingCopy>
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
    <View className="flex-1" style={{ backgroundColor: palette.background }}>
      <StatusBar style={activeTheme.statusBarStyle} />

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
              className="flex-1"
              style={{
                width: slideWidth,
                height: height,
                backgroundColor: palette.background,
              }}
            >
              <View
                className="flex-1 items-center justify-center"
                style={{ paddingTop: insets.top }}
              >
                <AlertHeroIcon size={heroSize}>
                  {item.renderIcon(iconSize)}
                </AlertHeroIcon>
              </View>

              <View
                style={{
                  position: "absolute",
                  top: height / 2 - 19,
                  left: 24,
                  right: 24,
                  flexDirection: "row",
                  justifyContent: "space-between",
                  zIndex: 10,
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

              <View
                className="rounded-t-[52px] px-6 pt-8"
                style={{
                  width: slideWidth,
                  backgroundColor: palette.panelBackground,
                  paddingBottom: Math.max(insets.bottom, 16),
                }}
              >
                <Text
                  className="mb-10 font-ubuntu-bold text-[30px] leading-[28px]"
                  style={{ color: palette.panelText }}
                >
                  {item.title}
                </Text>

                <View className="mb-10">{item.body}</View>

                {item.ctaLabel ? (
                  <TouchableOpacity
                    accessibilityRole="button"
                    activeOpacity={0.85}
                    onPress={() => router.replace(item.route ?? "/alertas")}
                    className="mb-6 w-full items-center justify-center overflow-hidden rounded-lg px-3 py-[14px]"
                    style={{
                      backgroundColor: palette.actionBackground,
                    }}
                  >
                    <Text
                      className="font-ubuntu-bold text-[14px] leading-[18px]"
                      style={{ color: palette.actionText }}
                    >
                      {item.ctaLabel}
                    </Text>
                  </TouchableOpacity>
                ) : null}

                <OnboardingProgress
                  total={slides.length}
                  activeIndex={activeIndex}
                />
              </View>
            </View>
          );
        }}
      />
    </View>
  );
}
