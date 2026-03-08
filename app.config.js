const appBaseConfig = require('./src/config/AppBaseConfig.json');

module.exports = ({ config }) => ({
  ...config,
  name: appBaseConfig.metadata.name,
  slug: appBaseConfig.metadata.slug,
  version: appBaseConfig.metadata.version,
  orientation: appBaseConfig.metadata.orientation,
  icon: appBaseConfig.assets.appIcon,
  scheme: appBaseConfig.metadata.scheme,
  userInterfaceStyle: 'automatic',
  ios: {
    icon: appBaseConfig.assets.iosIcon,
    bundleIdentifier: appBaseConfig.metadata.iosBundleIdentifier,
  },
  android: {
    package: appBaseConfig.metadata.androidPackage,
    adaptiveIcon: {
      backgroundColor: appBaseConfig.assets.androidAdaptiveIcon.backgroundColor,
      foregroundImage: appBaseConfig.assets.androidAdaptiveIcon.foregroundImage,
      backgroundImage: appBaseConfig.assets.androidAdaptiveIcon.backgroundImage,
      monochromeImage: appBaseConfig.assets.androidAdaptiveIcon.monochromeImage,
    },
    predictiveBackGestureEnabled: false,
  },
  web: {
    output: 'static',
    favicon: appBaseConfig.assets.webFavicon,
  },
  plugins: [
    [
      'expo-build-properties',
      {
        ios: {
          buildReactNativeFromSource: true,
        },
      },
    ],
    './plugins/WithFollyHeaderPathFix',
    'expo-router',
    [
      'expo-splash-screen',
      {
        backgroundColor: appBaseConfig.assets.splash.backgroundColor,
        image: appBaseConfig.assets.splash.image,
        imageWidth: appBaseConfig.assets.splash.imageWidth,
        dark: {
          image: appBaseConfig.assets.splash.darkImage,
          backgroundColor: appBaseConfig.assets.splash.darkBackgroundColor,
        },
      },
    ],
  ],
  experiments: {
    typedRoutes: true,
    reactCompiler: true,
  },
});
