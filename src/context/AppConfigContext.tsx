import React, {
    createContext,
    useCallback,
    useContext,
    useMemo,
    useState,
} from "react";
import { Appearance, useColorScheme } from "react-native";

import {
    appBaseConfig,
    createInitialRuntimeConfig,
} from "@/config/AppBaseConfig";
import {
    AppApiConfig,
    BrandingConfig,
    ColorMode,
    RuntimeAppConfig,
    ThemePalette,
} from "@/types/AppConfig";

type ResolvedColorMode = "light" | "dark";

type AppConfigContextValue = {
  config: RuntimeAppConfig;
  activeTheme: ThemePalette;
  resolvedColorMode: ResolvedColorMode;
  setColorMode: (mode: ColorMode) => void;
  setThemePalette: (
    mode: ResolvedColorMode,
    partialTheme: Partial<ThemePalette>,
  ) => void;
  setBranding: (partialBranding: Partial<BrandingConfig>) => void;
  setApi: (partialApi: Partial<AppApiConfig>) => void;
  resetConfig: () => void;
};

const AppConfigContext = createContext<AppConfigContextValue | null>(null);

export function AppConfigProvider({ children }: { children: React.ReactNode }) {
  const [config, setConfig] = useState<RuntimeAppConfig>(
    createInitialRuntimeConfig(),
  );
  const systemScheme = useColorScheme() ?? Appearance.getColorScheme();

  const resolvedColorMode: ResolvedColorMode =
    config.theme.colorMode === "system"
      ? systemScheme === "dark"
        ? "dark"
        : "light"
      : config.theme.colorMode;

  const activeTheme = config.theme[resolvedColorMode];

  const setColorMode = useCallback((mode: ColorMode) => {
    setConfig((previousConfig) => ({
      ...previousConfig,
      theme: {
        ...previousConfig.theme,
        colorMode: mode,
      },
    }));
  }, []);

  const setThemePalette = useCallback(
    (mode: ResolvedColorMode, partialTheme: Partial<ThemePalette>) => {
      setConfig((previousConfig) => ({
        ...previousConfig,
        theme: {
          ...previousConfig.theme,
          [mode]: {
            ...previousConfig.theme[mode],
            ...partialTheme,
          },
        },
      }));
    },
    [],
  );

  const setBranding = useCallback(
    (partialBranding: Partial<BrandingConfig>) => {
      setConfig((previousConfig) => ({
        ...previousConfig,
        branding: {
          ...previousConfig.branding,
          ...partialBranding,
        },
      }));
    },
    [],
  );

  const setApi = useCallback((partialApi: Partial<AppApiConfig>) => {
    setConfig((previousConfig) => ({
      ...previousConfig,
      api: {
        ...previousConfig.api,
        ...partialApi,
      },
    }));
  }, []);

  const resetConfig = useCallback(() => {
    setConfig(createInitialRuntimeConfig());
  }, []);

  const value = useMemo(
    () => ({
      config,
      activeTheme,
      resolvedColorMode,
      setColorMode,
      setThemePalette,
      setBranding,
      setApi,
      resetConfig,
    }),
    [
      config,
      activeTheme,
      resolvedColorMode,
      setColorMode,
      setThemePalette,
      setBranding,
      setApi,
      resetConfig,
    ],
  );

  return (
    <AppConfigContext.Provider value={value}>
      {children}
    </AppConfigContext.Provider>
  );
}

export function useAppConfig() {
  const appConfigContext = useContext(AppConfigContext);

  if (!appConfigContext) {
    throw new Error("useAppConfig must be used inside AppConfigProvider");
  }

  return appConfigContext;
}

export const DEFAULT_COLOR_MODE = appBaseConfig.theme.colorMode;
