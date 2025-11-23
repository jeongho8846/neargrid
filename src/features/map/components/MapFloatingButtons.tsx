// src/features/map/components/MapFloatingButtons.tsx

import React, { useRef } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import BottomSheet from '@gorhom/bottom-sheet';
import AppText from '@/common/components/AppText';
import AppIcon from '@/common/components/AppIcon';
import { COLORS } from '@/common/styles/colors';
import { SPACING } from '@/common/styles/spacing';

type Props = {
  sheetRef: React.RefObject<BottomSheet>;
};

const MapFloatingButtons: React.FC<Props> = ({ sheetRef }) => {
  return (
    <>
      {/* 발자국 버튼 */}
      <TouchableOpacity
        style={styles.leftButton}
        onPress={() => {}}
        activeOpacity={0.8}
      >
        <AppIcon name="footsteps" type="ion" size={24} variant="primary" />
      </TouchableOpacity>

      {/* 리스트 보기 버튼 */}
      <TouchableOpacity
        style={styles.showListButton}
        activeOpacity={0.8}
        onPress={() => sheetRef.current?.snapToIndex(1)}
      >
        <AppText i18nKey="STR_MAP_BUTTON_SHOWLIST" variant="button" />
      </TouchableOpacity>
    </>
  );
};

export default MapFloatingButtons;

const styles = StyleSheet.create({
  leftButton: {
    position: 'absolute',
    top: 10,
    left: SPACING.xs,
    backgroundColor: COLORS.sheet_background,
    padding: 8,
    borderRadius: 10,
  },
  showListButton: {
    backgroundColor: COLORS.button_active,
    position: 'absolute',
    bottom: 120,
    alignSelf: 'center',
    borderRadius: 24,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
