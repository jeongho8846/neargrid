// src/common/components/skeletons/AppSkeletonProfileRow.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import AppSkeletonLoader from './AppSkeletonLoader';
import { SPACING } from 'src/common/styles';

/**
 * ✅ 프로필 이미지 + 닉네임줄
 * - 피드, 댓글, DM, 알림 등에서 공용 사용
 */
const AppSkeletonProfileRow = () => {
  return (
    <View style={styles.row}>
      <AppSkeletonLoader width={36} height={36} borderRadius={18} />
      <AppSkeletonLoader width={120} height={14} borderRadius={4} />
    </View>
  );
};

export default AppSkeletonProfileRow;

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.sm,
  },
});
