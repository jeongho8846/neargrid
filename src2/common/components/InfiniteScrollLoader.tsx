import React from 'react';
import { View, StyleSheet } from 'react-native';
import AppLoading from './AppLoading';
import { SPACING } from '../styles/tokens';

type Props = {
  isLoading?: boolean;
};

export default function InfiniteScrollLoader({ isLoading }: Props) {
  if (!isLoading) return null;
  return (
    <View style={styles.container}>
      <AppLoading size="small" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: SPACING.md,
  },
});
