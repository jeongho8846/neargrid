import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { CARD } from '../styles/presets';

type Variant = keyof typeof CARD;

type Props = {
  variant?: Variant;
  style?: ViewStyle;
  children?: React.ReactNode;
};

export default function AppCard({ variant = 'base', style, children }: Props) {
  return <View style={[CARD[variant], style]}>{children}</View>;
}

const styles = StyleSheet.create({});
