// src/common/components/Skeletons/AppSkeletonTextLines.tsx
import React from 'react';
import { View, DimensionValue } from 'react-native'; // ✅ 추가
import AppSkeletonLoader from './AppSkeletonLoader';
import { SPACING } from '@/common/styles/spacing';

type Props = {
  count?: number; // 기본 2줄
  width?: DimensionValue; // ✅ 타입 수정 (number | `${number}%`)
};

/**
 * ✅ 텍스트 여러 줄 스켈레톤
 * - 피드 본문, 댓글 본문 등
 */
const AppSkeletonTextLines: React.FC<Props> = ({
  count = 2,
  width = '90%',
}) => {
  return (
    <View>
      {Array.from({ length: count }).map((_, i) => (
        <View key={i} style={{ marginBottom: SPACING.xs }}>
          <AppSkeletonLoader
            width={i === count - 1 ? ('70%' as DimensionValue) : width} // ✅ 타입 캐스팅
            height={16}
            borderRadius={4}
          />
        </View>
      ))}
    </View>
  );
};

export default AppSkeletonTextLines;
