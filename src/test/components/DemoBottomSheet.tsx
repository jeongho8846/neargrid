import React from 'react';
import {
  Modal,
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import { TEST_COLORS } from '@/test/styles/colors';
import { TEST_RADIUS } from '@/test/styles/radius';
import { TEST_SPACING } from '@/test/styles/spacing';
import { TEST_SHADOW } from '@/test/styles/shadows';
import { FONT } from '@/test/styles/FONT';

type Props = {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children?: React.ReactNode;
};

const DemoBottomSheet: React.FC<Props> = ({
  visible,
  onClose,
  title = 'Bottom Sheet',
  children,
}) => {
  return (
    <Modal visible={visible} transparent animationType="slide">
      <Pressable style={styles.backdrop} onPress={onClose} />
      <View style={styles.sheetContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>{title}</Text>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.close}>✕</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.content}>{children}</View>
      </View>
    </Modal>
  );
};

export default DemoBottomSheet;

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    bottom: -10,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  sheetContainer: {
    position: 'absolute',
    bottom: 80,
    left: 0,
    right: 0,
    backgroundColor: TEST_COLORS.surface,
    borderTopLeftRadius: TEST_RADIUS.xl,
    borderTopRightRadius: TEST_RADIUS.xl,
    paddingHorizontal: TEST_SPACING.lg,
    paddingTop: TEST_SPACING.md,
    paddingBottom: TEST_SPACING.xl,
    ...TEST_SHADOW.soft,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: TEST_SPACING.sm,
  },
  title: {
    ...FONT.title, // ✅ 공통 폰트 적용
  },
  close: {
    ...FONT.body,
    color: TEST_COLORS.text_secondary,
    fontSize: 20, // 닫기 아이콘 크기만 살짝 조정
  },
  content: {
    paddingTop: TEST_SPACING.xs,
  },
});
