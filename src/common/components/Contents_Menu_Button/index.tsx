// src/common/components/Contents_Menu_Button/index.tsx
import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import AppIcon from '@/common/components/AppIcon';
import { COLORS } from '@/common/styles/colors';

type Props = {
  onOpen: () => void; // ✅ 누르면 무엇을 열지 호출자가 결정
  size?: number;
  color?: string;
  hitSlop?: { top?: number; bottom?: number; left?: number; right?: number };
};

const ContentsMenuButton: React.FC<Props> = ({
  onOpen,
  size = 18,
  color = COLORS.text_secondary,
  hitSlop = { top: 8, bottom: 8, left: 8, right: 8 },
}) => {
  return (
    <TouchableOpacity style={styles.button} hitSlop={hitSlop} onPress={onOpen}>
      <AppIcon type="ion" name="ellipsis-vertical" size={size} color={color} />
    </TouchableOpacity>
  );
};

export default ContentsMenuButton;

const styles = StyleSheet.create({
  button: { paddingHorizontal: 4, paddingVertical: 4 },
});
