// 📄 src/test/components/DemoListItem.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { TEST_COLORS } from '@/test/styles/colors';
import { TEST_RADIUS } from '@/test/styles/radius';
import { TEST_SPACING } from '@/test/styles/spacing';
import { TEST_SHADOW } from '@/test/styles/shadows';
import { FONT } from '@/test/styles/FONT';

type Props = {
  title: string;
  subtitle?: string;
  likeCount?: number;
  commentCount?: number;
};

const DemoListItem: React.FC<Props> = ({
  title,
  subtitle,
  likeCount,
  commentCount,
}) => {
  return (
    <View style={styles.container}>
      {/* 왼쪽 텍스트 영역 */}
      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>

      {/* 오른쪽 아이콘 + 카운트 영역 */}
      <View style={styles.rightContainer}>
        {typeof likeCount === 'number' && (
          <View style={styles.iconRow}>
            <Ionicons
              name="heart-outline"
              size={18}
              color={TEST_COLORS.text_secondary}
            />
            <Text style={styles.countText}>{likeCount}</Text>
          </View>
        )}
        {typeof commentCount === 'number' && (
          <View style={styles.iconRow}>
            <Ionicons
              name="chatbubble-outline"
              size={18}
              color={TEST_COLORS.text_secondary}
            />
            <Text style={styles.countText}>{commentCount}</Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default DemoListItem;

/* ──────────────── 스타일 ──────────────── */
const styles = StyleSheet.create({
  container: {
    backgroundColor: TEST_COLORS.surface,
    borderRadius: TEST_RADIUS.md,
    paddingVertical: TEST_SPACING.md,
    paddingHorizontal: TEST_SPACING.lg,
    marginVertical: TEST_SPACING.xs,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    ...TEST_SHADOW.soft,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    ...FONT.body,
    fontWeight: '600' as const, // ✅ TypeScript 호환
    color: TEST_COLORS.text_primary,
  },
  subtitle: {
    ...FONT.caption,
    color: TEST_COLORS.text_secondary,
    marginTop: TEST_SPACING.xs / 2,
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: TEST_SPACING.md,
  },
  countText: {
    ...FONT.caption,
    color: TEST_COLORS.text_secondary,
    marginLeft: 4,
    fontWeight: '500' as const, // ✅ 문자열 리터럴로 고정
  },
});
