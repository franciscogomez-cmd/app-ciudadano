import React from 'react';
import { Pressable, Text, ViewStyle } from 'react-native';

import { useAppConfig } from '@/context/AppConfigContext';

type ButtonVariant = 'primary' | 'secondary' | 'outline';

type AppButtonProps = {
  label: string;
  onPress?: () => void;
  variant?: ButtonVariant;
};

export function AppButton({ label, onPress, variant = 'primary' }: AppButtonProps) {
  const { activeTheme } = useAppConfig();

  const baseStyle: ViewStyle = {
    borderRadius: 14,
    minHeight: 52,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  };

  const variantStyle: Record<ButtonVariant, ViewStyle> = {
    primary: {
      backgroundColor: activeTheme.primary,
      borderColor: activeTheme.primary,
    },
    secondary: {
      backgroundColor: activeTheme.secondary,
      borderColor: activeTheme.secondary,
    },
    outline: {
      backgroundColor: 'transparent',
      borderColor: activeTheme.border,
    },
  };

  const labelColor = variant === 'outline' ? activeTheme.text : activeTheme.buttonText;

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        baseStyle,
        variantStyle[variant],
        {
          opacity: pressed ? 0.85 : 1,
        },
      ]}>
      <Text className="text-base font-semibold" style={{ color: labelColor }}>
        {label}
      </Text>
    </Pressable>
  );
}
