import React from 'react';
import { TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import AppIcon from '@/common/components/AppIcon';
import { TEST_COLORS } from '@/test/styles/colors';
import { TEST_RADIUS } from '@/test/styles/radius';
import { TEST_SHADOW } from '@/test/styles/shadows';

/**
 * ✅ MapControlButton
 * - 지도 위에 떠 있는 플로팅 버튼
 * - zoom, locate 등 컨트롤용
 */
type Props = {
  icon: string;
  onPress?: () => void;
  style?: ViewStyle;
};

const MapControlButton: React.FC<Props> = ({ icon, onPress, style }) => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={[styles.button, style]}
    >
      <AppIcon name={icon} type="ion" size={20} variant="onDark" />
    </TouchableOpacity>
  );
};

export default MapControlButton;

/* ──────────────── 스타일 ──────────────── */
const styles = StyleSheet.create({
  button: {
    width: 44,
    height: 44,
    borderRadius: TEST_RADIUS.md,
    backgroundColor: TEST_COLORS.surface, // ✅ 공통 surface tone
    justifyContent: 'center',
    alignItems: 'center',
    ...TEST_SHADOW.soft, // ✅ 살짝 강한 그림자 (플로팅 느낌)
  },
});
