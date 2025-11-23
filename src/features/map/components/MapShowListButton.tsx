// src/features/map/components/MapShowListButton.tsx
import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import AppText from '@/common/components/AppText';
import { COLORS } from '@/common/styles/colors';
import { SPACING } from '@/common/styles/spacing';
import { useBottomSheetStore } from '@/common/state/bottomSheetStore';

type Props = {
  onPress: () => void;
};

const MapShowListButton: React.FC<Props> = ({ onPress }) => {
  const { isOpen } = useBottomSheetStore();

  // ✅ 바텀시트가 열려있으면 버튼 안 보임
  if (isOpen) return null;

  return (
    <TouchableOpacity
      style={styles.button}
      activeOpacity={0.8}
      onPress={onPress}
    >
      <AppText i18nKey="STR_MAP_BUTTON_SHOWLIST" variant="button" />
    </TouchableOpacity>
  );
};

export default MapShowListButton;

const styles = StyleSheet.create({
  button: {
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
