import React from 'react';
import { StyleSheet, View, StyleProp, ViewStyle } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { COLORS } from '@/common/styles/tokens/colors';

type Props = {
  name: string; // Ionicons 이름
  size?: number;
  color?: string;
  style?: StyleProp<ViewStyle>;
};

/**
 * ✅ AppIcon
 * - 모든 아이콘은 Ionicons 기반
 * - color 기본값은 COLORS.text_primary
 * - 직접 react-native-vector-icons 사용 금지
 */
export default function AppIcon({
  name,
  size = 24,
  color = COLORS.text_primary,
  style,
}: Props) {
  return (
    <View style={[styles.root, style]}>
      <Ionicons name={name} size={size} color={color} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
