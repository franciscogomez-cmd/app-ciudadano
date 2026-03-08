import { AppApiConfig, BrandingConfig, RuntimeAppConfig } from '@/types/AppConfig';

type AppBaseConfig = {
  metadata: {
    name: string;
    slug: string;
    scheme: string;
    androidPackage: string;
    iosBundleIdentifier: string;
    version: string;
    orientation: 'portrait' | 'landscape' | 'default';
  };
  branding: BrandingConfig;
  theme: RuntimeAppConfig['theme'];
  navigationTabs: RuntimeAppConfig['tabs'];
  assets: {
    appIcon: string;
    iosIcon: string;
    webFavicon: string;
    androidAdaptiveIcon: {
      backgroundColor: string;
      foregroundImage: string;
      backgroundImage: string;
      monochromeImage: string;
    };
    splash: {
      image: string;
      darkImage: string;
      backgroundColor: string;
      darkBackgroundColor: string;
      imageWidth: number;
    };
  };
  apiDefaults: {
    defaultHeaders: Record<string, string>;
  };
};

export const appBaseConfig = require('./AppBaseConfig.json') as AppBaseConfig;

const resolveApiBaseUrl = () => {
  const value = process.env.EXPO_PUBLIC_API_BASE_URL;

  if (!value || !value.trim()) {
    throw new Error(
      'Missing EXPO_PUBLIC_API_BASE_URL. Define it in .env before running the app.'
    );
  }

  return value.replace(/\/+$/, '');
};

const createApiConfig = (): AppApiConfig => ({
  baseUrl: resolveApiBaseUrl(),
  defaultHeaders: {
    ...appBaseConfig.apiDefaults.defaultHeaders,
  },
});

const createBrandingConfig = (): BrandingConfig => {
  if (appBaseConfig.branding.logo.kind === 'none') {
    return {
      appName: appBaseConfig.branding.appName,
      logo: {
        kind: 'none',
      },
    };
  }

  if (appBaseConfig.branding.logo.kind === 'remote') {
    if (!appBaseConfig.branding.logo.uri || !appBaseConfig.branding.logo.uri.trim()) {
      return {
        appName: appBaseConfig.branding.appName,
        logo: {
          kind: 'none',
        },
      };
    }

    return {
      appName: appBaseConfig.branding.appName,
      logo: {
        kind: 'remote',
        uri: appBaseConfig.branding.logo.uri,
      },
    };
  }

  return {
    appName: appBaseConfig.branding.appName,
    logo: {
      kind: 'local',
      key: appBaseConfig.branding.logo.key,
    },
  };
};

export const runtimeApiConfig = createApiConfig();

export const createInitialRuntimeConfig = (): RuntimeAppConfig => ({
  api: {
    ...runtimeApiConfig,
    defaultHeaders: {
      ...runtimeApiConfig.defaultHeaders,
    },
  },
  tabs: {
    ios: {
      ...appBaseConfig.navigationTabs.ios,
    },
    android: {
      ...appBaseConfig.navigationTabs.android,
    },
    web: {
      ...appBaseConfig.navigationTabs.web,
    },
  },
  theme: {
    colorMode: appBaseConfig.theme.colorMode,
    light: {
      ...appBaseConfig.theme.light,
    },
    dark: {
      ...appBaseConfig.theme.dark,
    },
  },
  branding: createBrandingConfig(),
});
