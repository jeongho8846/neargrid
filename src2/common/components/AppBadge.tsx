import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BADGE } from '../styles/presets';
import { useTranslation } from 'react-i18next';

type Variant = 'primary' | 'secondary' | 'outline';

type Props = {
  labelTKey: string;
  variant?: Variant;
};

export default function AppBadge({ labelTKey, variant = 'primary' }: Props) {
  const { t } = useTranslation();

  const variantStyle =
    variant === 'secondary'
      ? styles.secondary
      : variant === 'outline'
      ? styles.outline
      : null;

  return (
    <View style={[styles.container, variantStyle]}>
      <Text style={styles.text}>{t(labelTKey).toUpperCase()}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: BADGE.container,
  text: BADGE.text,
  secondary: BADGE.secondary,
  outline: BADGE.outline,
});
