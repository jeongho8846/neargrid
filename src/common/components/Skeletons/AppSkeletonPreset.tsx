// src/common/components/skeletons/AppSkeletonPreset.tsx
import React from 'react';
import { View } from 'react-native';
import AppSkeletonProfileRow from './AppSkeletonProfileRow';
import AppSkeletonTextLines from './AppSkeletonTextLines';
import AppSkeletonMediaBox from './AppSkeletonMediaBox';
import { SPACING } from 'src/common/styles';

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
