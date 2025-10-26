// src/features/thread/components/ThreadComment_item_card.tsx
import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import AppText from '@/common/components/AppText';
import AppProfileImage from '@/common/components/AppProfileImage';
import { ThreadComment } from '../model/ThreadCommentModel';
import ContentsHeartButton from '@/common/components/Contents_Heart_Button';
import { COLORS } from '@/common/styles/colors';
import { FONT } from '@/common/styles/typography';
import { SPACING } from '@/common/styles/spacing';
import { AppSkeletonPreset } from '@/common/components/Skeletons'; // ✅ 추가

type Props = {
  comment: ThreadComment;
  onPressReply?: (comment: ThreadComment) => void;
};

const ThreadCommentItem: React.FC<Props> = ({ comment, onPressReply }) => {
  const isChild = (comment as any)?.depth > 0;
  const isSkeleton = comment.isSkeleton === true;

  if (isSkeleton) {
    return (
      <View style={[styles.container, { opacity: 0.9 }]}>
        <AppSkeletonPreset type="simple" />
      </View>
    );
  }

  return (
    <View style={[styles.container, isChild && { marginLeft: SPACING.lg + 4 }]}>
      <View style={styles.left}>
        <AppProfileImage
          imageUrl={comment.memberProfileImageUrl}
          memberId={comment.memberId}
          size={36}
        />
      </View>

      <View style={styles.center}>
        <View style={styles.headerRow}>
          <AppText style={styles.nick}>{comment.memberNickName}</AppText>
          <AppText style={styles.date}>
            {comment.createDatetime?.split('T')[0] ?? ''}
          </AppText>
        </View>

        <AppText style={styles.desc}>{comment.description}</AppText>

        <TouchableOpacity
          activeOpacity={0.6}
          onPress={() => onPressReply?.(comment)}
        >
          <AppText style={styles.replyBtn}>답글 달기</AppText>
        </TouchableOpacity>
      </View>

      <View style={styles.right}>
        <ContentsHeartButton
          liked={!!comment.reactedByCurrentMember}
          onToggle={() => {}}
          size={18}
        />
        {!!comment.reactionCount && (
          <AppText style={styles.likeCount}>{comment.reactionCount}</AppText>
        )}
      </View>
    </View>
  );
};

export default ThreadCommentItem;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.sm,
  },

  left: {
    width: 40,
    alignItems: 'center',
    marginRight: SPACING.xs,
    top: SPACING.xs,
  },

  center: {
    flex: 1,
    marginLeft: SPACING.sm,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  nick: {
    ...FONT.body,
    color: COLORS.text,
    marginRight: 6,
  },
  date: {
    ...FONT.caption,
    color: COLORS.text_secondary,
  },
  desc: {
    ...FONT.body,
    color: COLORS.text,
    lineHeight: 20,
  },
  replyBtn: {
    ...FONT.caption,
    color: COLORS.text_secondary,
    marginTop: 4,
  },

  right: {
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: SPACING.sm,
  },
  likeCount: {
    ...FONT.caption,
    color: COLORS.text,
    marginLeft: 4,
  },
});
