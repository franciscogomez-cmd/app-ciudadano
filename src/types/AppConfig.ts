import { ImageSourcePropType } from 'react-native';

export type StatusBarStyle = 'light' | 'dark';
export type ColorMode = 'system' | 'light' | 'dark';

export type ThemePalette = {
  primary: string;
  secondary: string;
  background: string;
  surface: string;
  text: string;
  textMuted: string;
  border: string;
  buttonText: string;
  statusBarStyle: StatusBarStyle;
};

export type AlertsModulePalette = {
  shellBackground: string;
  panelBackground: string;
  panelText: string;
  progressActive: string;
  progressInactive: string;
  circleStart: string;
  circleEnd: string;
  circleGlow: string;
  actionBackground: string;
  actionText: string;
  tileIcon: string;
  tileText: string;
  severity: {
    preventive: string;
    emergency: string;
    informative: string;
  };
  switchActive: string;
  switchInactive: string;
  map: {
    primary: string;
    secondary: string;
    marker: string;
  };
};

export type AppTheme = {
  colorMode: ColorMode;
  light: ThemePalette;
  dark: ThemePalette;
};

export type NavigationTabsConfig = {
  ios: {
    tintColor: string;
  };
  android: {
    activeBackground: string;
    activeForeground: string;
    inactiveBackground: string;
    inactiveForeground: string;
  };
  web: {
    activeBackground: string;
    activeForeground: string;
    inactiveBackground: string;
    inactiveForeground: string;
  };
};

export type AppApiConfig = {
  baseUrl: string;
  defaultHeaders: Record<string, string>;
};

export type BrandingAsset =
  | {
      kind: 'none';
    }
  | {
      kind: 'local';
      key: 'default' | 'glow';
      source?: ImageSourcePropType;
    }
  | {
      kind: 'remote';
      uri: string;
    };

export type BrandingConfig = {
  appName: string;
  logo: BrandingAsset;
};

export type RuntimeAppConfig = {
  api: AppApiConfig;
  theme: AppTheme;
  tabs: NavigationTabsConfig;
  branding: BrandingConfig;
  modules: {
    alerts: AlertsModulePalette;
  };
};
