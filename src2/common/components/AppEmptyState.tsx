import React from 'react';
import { View, StyleSheet } from 'react-native';
import AppText from './AppText';
import AppIcon from './AppIcon';
import { LAYOUT } from '../styles/presets';
import { COLORS, SPACING } from '../styles/tokens';

type Props = {
  icon?: string;
  tKey: string;
};

export default function AppEmptyState({ icon = 'cube-outline', tKey }: Props) {
  return (
    <View style={[LAYOUT.centered, styles.container]}>
      <AppIcon name={icon} size={40} color={COLORS.text_secondary} />
      <AppText tKey={tKey} variant="caption" style={styles.text} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: SPACING.xl,
    gap: SPACING.sm,
  },
  text: {
    textAlign: 'center',
  },
});
