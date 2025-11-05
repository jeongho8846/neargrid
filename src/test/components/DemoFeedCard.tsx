import React from 'react';
import { View, StyleSheet } from 'react-native';
import AppText from '@/common/components/AppText';
import AppIcon from '@/common/components/AppIcon';
import AppProfileImage from '@/common/components/AppProfileImage';
import { TEST_COLORS } from '@/test/styles/colors';
import { TEST_RADIUS } from '@/test/styles/radius';
import { TEST_SPACING } from '@/test/styles/spacing';

type Props = {
  username: string;
  time: string;
  text: string;
  likes: number;
  comments: number;
};

const DemoFeedCard: React.FC<Props> = ({
  username,
  time,
  text,
  likes,
  comments,
}) => {
  return (
    <View style={styles.card}>
      {/* 🔹 Header */}
      <View style={styles.header}>
        <View style={styles.cardHeader}>
          <View style={styles.row}>
            <AppProfileImage size={36} />
            <View style={{ marginLeft: 10 }}>
              <AppText variant="username">{username}</AppText>
              <AppText variant="caption">{time}</AppText>
            </View>
          </View>
          <AppIcon name="ellipsis-horizontal" type="ion" variant="secondary" />
        </View>
      </View>

      {/* 🔹 Middle (이미지 영역: 패딩 없음, 꽉차게) */}
      <View style={styles.middle}>
        <View style={styles.imagePlaceholder}>
          <AppText variant="caption">📸 이미지</AppText>
        </View>
      </View>

      {/* 🔹 Footer */}
      <View style={styles.footer}>
        {/* 본문 */}
        <AppText variant="body" style={{ marginVertical: 4 }}>
          {text}
        </AppText>

        {/* ✅ 액션 아이콘 + 카운트 */}
        <View style={styles.actionRow}>
          <View style={styles.row}>
            {/* ❤️ 좋아요 */}
            <View style={styles.iconGroup}>
              <AppIcon name="heart-outline" type="ion" variant="primary" />
              <AppText variant="caption" style={styles.countText}>
                {likes}
              </AppText>
            </View>

            {/* 💬 댓글 */}
            <View style={[styles.iconGroup, { marginLeft: 16 }]}>
              <AppIcon name="chatbubble-outline" type="ion" variant="primary" />
              <AppText variant="caption" style={styles.countText}>
                {comments}
              </AppText>
            </View>

            {/* 📤 공유 */}
            <View style={[styles.iconGroup, { marginLeft: 16 }]}>
              <AppIcon
                name="paper-plane-outline"
                type="ion"
                variant="primary"
              />
            </View>
          </View>

          {/* 🔖 북마크 */}
          <AppIcon name="bookmark-outline" type="ion" variant="secondary" />
        </View>
      </View>
    </View>
  );
};

export default DemoFeedCard;

/* ──────────────── 스타일 ──────────────── */
const styles = StyleSheet.create({
  card: {
    backgroundColor: TEST_COLORS.surface,
    borderRadius: TEST_RADIUS.lg,
    overflow: 'hidden',
    marginBottom: 20,
  },
  header: {
    paddingHorizontal: TEST_SPACING.md,
    paddingTop: TEST_SPACING.md,
  },
  footer: {
    paddingHorizontal: TEST_SPACING.md,
    paddingVertical: TEST_SPACING.md,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: TEST_SPACING.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  middle: {},
  imagePlaceholder: {
    width: '100%',
    height: 500,
    backgroundColor: TEST_COLORS.surface_light,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: TEST_SPACING.xs,
  },
  iconGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  countText: {
    marginLeft: 4,
    color: TEST_COLORS.text_secondary,
  },
});
