// 📄 src/common/components/Contents_Menu_Button/index.tsx
import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import AppIcon from '@/common/components/AppIcon';

type Props = {
  onOpen: () => void; // ✅ 호출자가 열기 동작 결정
  size?: number;
  variant?: 'primary' | 'secondary' | 'active' | 'liked';
  hitSlop?: { top?: number; bottom?: number; left?: number; right?: number };
};

/**
 * ✅ ContentsMenuButton
 * - Thread / Comment 등에서 메뉴(⋮) 버튼으로 사용
 * - AppIcon variant 규칙 완전 통일
 */
const ContentsMenuButton: React.FC<Props> = ({
  onOpen,
  size = 18,
  variant = 'secondary',
  hitSlop = { top: 8, bottom: 8, left: 8, right: 8 },
}) => {
  return (
    <TouchableOpacity style={styles.button} hitSlop={hitSlop} onPress={onOpen}>
      <AppIcon
        type="ion"
        name="ellipsis-vertical"
        size={size}
        variant={variant}
      />
    </TouchableOpacity>
  );
};

export default ContentsMenuButton;

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 4,
    paddingVertical: 4,
  },
});
