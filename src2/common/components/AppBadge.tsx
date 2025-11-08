import React from 'react';
import { View, StyleSheet } from 'react-native';
import { BADGE } from '../styles/presets';
import AppText from './AppText';

type Variant = 'primary' | 'secondary' | 'outline';

type Props = {
  labelTKey: string;
  variant?: Variant;
};

export default function AppBadge({ labelTKey, variant = 'primary' }: Props) {
  const variantStyle =
    variant === 'secondary'
      ? styles.secondary
      : variant === 'outline'
      ? styles.outline
      : null;

  return (
    <View style={[styles.container, variantStyle]}>
      <AppText tKey={labelTKey} variant="label" style={styles.text} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: BADGE.container,
  text: BADGE.text,
  secondary: BADGE.secondary,
  outline: BADGE.outline,
});
