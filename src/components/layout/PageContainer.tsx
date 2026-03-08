import React from 'react';
import { Platform, ScrollView, View, ViewProps } from 'react-native';
import { Edge, SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAppConfig } from '@/context/AppConfigContext';
import { useResponsiveMetrics } from '@/utils/Responsive';

type PageContainerProps = {
  children: React.ReactNode;
  scroll?: boolean;
} & ViewProps;

export function PageContainer({ children, scroll = false, style, ...rest }: PageContainerProps) {
  const { activeTheme } = useAppConfig();
  const metrics = useResponsiveMetrics();
  const insets = useSafeAreaInsets();
  const isIOS = Platform.OS === 'ios';

  const safeAreaEdges: Edge[] | undefined = isIOS ? ['top', 'left', 'right'] : undefined;
  const bottomSpacing = isIOS ? insets.bottom + 84 : 0;

  if (scroll) {
    return (
      <SafeAreaView
        edges={safeAreaEdges}
        style={{ flex: 1, backgroundColor: activeTheme.background }}>
        <ScrollView
          contentContainerStyle={{
            paddingHorizontal: metrics.horizontalPadding,
            paddingTop: metrics.verticalPadding,
            paddingBottom: metrics.verticalPadding + bottomSpacing,
            gap: metrics.gap,
          }}
          style={{ flex: 1 }}>
          <View style={style} {...rest}>
            {children}
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      edges={safeAreaEdges}
      style={{ flex: 1, backgroundColor: activeTheme.background }}>
      <View
        style={[
          {
            flex: 1,
            paddingHorizontal: metrics.horizontalPadding,
            paddingTop: metrics.verticalPadding,
            paddingBottom: metrics.verticalPadding + bottomSpacing,
          },
          style,
        ]}
        {...rest}>
        {children}
      </View>
    </SafeAreaView>
  );
}
