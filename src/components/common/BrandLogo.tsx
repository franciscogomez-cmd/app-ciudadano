import { Image } from 'react-native';

import { useAppConfig } from '@/context/AppConfigContext';

type BrandLogoProps = {
  size?: number;
};

const LOCAL_LOGOS = {
  default: require('@/assets/images/expo-logo.png'),
  glow: require('@/assets/images/logo-glow.png'),
} as const;

export function BrandLogo({ size = 96 }: BrandLogoProps) {
  const {
    config: { branding },
  } = useAppConfig();

  if (branding.logo.kind === 'none') {
    return null;
  }

  const source =
    branding.logo.kind === 'remote'
      ? { uri: branding.logo.uri }
      : LOCAL_LOGOS[branding.logo.key] ?? LOCAL_LOGOS.default;

  return <Image source={source} style={{ width: size, height: size }} resizeMode="contain" />;
}
