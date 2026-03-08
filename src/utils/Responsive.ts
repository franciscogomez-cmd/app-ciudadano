import { Dimensions, PixelRatio, useWindowDimensions } from 'react-native';

const BASE_WIDTH = 390;
const BASE_HEIGHT = 844;

export const widthPercent = (percent: number) => {
  const { width } = Dimensions.get('window');
  return (width * percent) / 100;
};

export const heightPercent = (percent: number) => {
  const { height } = Dimensions.get('window');
  return (height * percent) / 100;
};

export const scale = (size: number) => {
  const { width } = Dimensions.get('window');
  const scaledSize = (width / BASE_WIDTH) * size;
  return PixelRatio.roundToNearestPixel(scaledSize);
};

export const verticalScale = (size: number) => {
  const { height } = Dimensions.get('window');
  const scaledSize = (height / BASE_HEIGHT) * size;
  return PixelRatio.roundToNearestPixel(scaledSize);
};

export const isTablet = () => {
  const { width, height } = Dimensions.get('window');
  const shortestSide = Math.min(width, height);
  return shortestSide >= 768;
};

export const useResponsiveMetrics = () => {
  const { width } = useWindowDimensions();
  const tablet = width >= 768;

  return {
    isTablet: tablet,
    horizontalPadding: tablet ? 32 : 20,
    verticalPadding: tablet ? 24 : 16,
    gap: tablet ? 20 : 14,
    logoSize: tablet ? 136 : 108,
    cardRadius: tablet ? 20 : 14,
  };
};
