// src/common/components/skeletons/AppSkeletonPreset.tsx
import React from 'react';
import { View } from 'react-native';
import AppSkeletonProfileRow from './AppSkeletonProfileRow';
import AppSkeletonTextLines from './AppSkeletonTextLines';
import AppSkeletonMediaBox from './AppSkeletonMediaBox';
import { SPACING } from '@/common/styles/spacing';

/**
 * ✅ 스켈레톤 프리셋 엔트리
 * - "detail": 프로필 + 이미지 + 텍스트
 * - "simple": 프로필 + 텍스트
 * - 필요 시 이후 "compact", "chat" 등 확장 가능
 */
type PresetType = 'detail' | 'simple';

type Props = {
  type?: PresetType;
};

const AppSkeletonPreset: React.FC<Props> = ({ type = 'detail' }) => {
  switch (type) {
    case 'detail':
      return (
        <View style={{ padding: SPACING.sm }}>
          <AppSkeletonProfileRow />
          <AppSkeletonMediaBox />
          <View style={{ marginTop: SPACING.sm }}>
            <AppSkeletonTextLines count={3} />
          </View>
        </View>
      );

    case 'simple':
      return (
        <View style={{ padding: SPACING.sm }}>
          <AppSkeletonProfileRow />
          <AppSkeletonTextLines count={2} />
        </View>
      );

    default:
      return null;
  }
};

export default AppSkeletonPreset;
