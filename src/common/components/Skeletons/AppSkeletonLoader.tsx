// src/common/components/skeletons/AppSkeletonLoader.tsx
import React from 'react';
import { View, StyleSheet, ViewStyle, DimensionValue } from 'react-native';
import { COLORS } from '@/common/styles/colors';

type Props = {
  width?: DimensionValue; // ✅ 수정됨
  height?: DimensionValue; // ✅ 수정됨
  borderRadius?: number;
  style?: ViewStyle;
};

/**
 * ✅ 스켈레톤 최소 단위 박스
 */
const AppSkeletonLoader: React.FC<Props> = ({
  width = '100%',
  height = 14,
  borderRadius = 4,
  style,
}) => {
  return <View style={[styles.base, { width, height, borderRadius }, style]} />;
};

export default AppSkeletonLoader;

const styles = StyleSheet.create({
  base: {
    backgroundColor: COLORS.skeleton_bone_light,
    overflow: 'hidden',
  },
});
