import React from 'react';
import { ScrollView, View, ViewProps } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAppConfig } from '@/context/AppConfigContext';
import { useResponsiveMetrics } from '@/utils/Responsive';

type PageContainerProps = {
  children: React.ReactNode;
  scroll?: boolean;
} & ViewProps;

export function PageContainer({ children, scroll = false, style, ...rest }: PageContainerProps) {
  const { activeTheme } = useAppConfig();
  const metrics = useResponsiveMetrics();

  if (scroll) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: activeTheme.background }}>
        <ScrollView
          contentContainerStyle={{
            paddingHorizontal: metrics.horizontalPadding,
            paddingVertical: metrics.verticalPadding,
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
    <SafeAreaView style={{ flex: 1, backgroundColor: activeTheme.background }}>
      <View
        style={[
          {
            flex: 1,
            paddingHorizontal: metrics.horizontalPadding,
            paddingVertical: metrics.verticalPadding,
          },
          style,
        ]}
        {...rest}>
        {children}
      </View>
    </SafeAreaView>
  );
}
