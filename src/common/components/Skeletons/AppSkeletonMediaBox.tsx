// src/common/components/skeletons/AppSkeletonMediaBox.tsx
import React from 'react';
import AppSkeletonLoader from './AppSkeletonLoader';
import { SPACING } from '@/common/styles/spacing';

/**
 * ✅ 이미지/비디오 영역용 placeholder
 * - 피드, 상세뷰 등에서 사용
 */
const AppSkeletonMediaBox = () => {
  return (
    <AppSkeletonLoader
      width="100%"
      height={300}
      borderRadius={8}
      style={{ marginTop: SPACING.sm }}
    />
  );
};

export default AppSkeletonMediaBox;
