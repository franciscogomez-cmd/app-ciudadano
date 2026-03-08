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

export type AppTheme = {
  colorMode: ColorMode;
  light: ThemePalette;
  dark: ThemePalette;
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
  branding: BrandingConfig;
};
