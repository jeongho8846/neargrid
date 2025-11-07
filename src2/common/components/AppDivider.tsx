import React from 'react';
import { View, StyleSheet, StyleSheet as RNStyleSheet } from 'react-native';
import { COLORS } from '../styles/tokens';

export default function AppDivider() {
  return <View style={styles.divider} />;
}

const styles = StyleSheet.create({
  divider: {
    height: RNStyleSheet.hairlineWidth,
    backgroundColor: COLORS.border_light,
    opacity: 0.3,
  },
});
