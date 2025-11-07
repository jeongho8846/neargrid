import React from 'react';
import { View, StyleSheet } from 'react-native';
import AppText from '@/common/components/AppText';
import { LAYOUT } from '@/common/styles/presets/layout';

export default function MapScreen() {
  return (
    <View style={styles.root}>
      <AppText tKey="screen.Map.title" />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    ...LAYOUT.screen,
  },
});
