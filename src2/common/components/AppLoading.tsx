import React from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { COLORS, SPACING } from '../styles/tokens';
import { LAYOUT } from '../styles/presets';

type Props = {
  size?: 'small' | 'large';
};

export default function AppLoading({ size = 'large' }: Props) {
  return (
    <View style={[LAYOUT.centered, styles.container]}>
      <ActivityIndicator size={size} color={COLORS.primary} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: SPACING.lg,
  },
});
