import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import AppText from '@/common/components/AppText';
import AppProfileImage from '@/common/components/AppProfileImage';
import { ThreadComment } from '../model/ThreadCommentModel';
import ContentsHeartButton from '@/common/components/Contents_Heart_Button';
import { COLORS } from '@/common/styles/colors';
import { FONT } from '@/common/styles/typography';
import { SPACING } from '@/common/styles/spacing';

type Props = {
  comment: ThreadComment;
  onPressReply?: (comment: ThreadComment) => void;
};

const ThreadCommentItem: React.FC<Props> = ({ comment, onPressReply }) => {
  const isChild = comment.depth > 0;

  return (
    <View
      style={[
        styles.container,
        isChild && { marginLeft: SPACING.lg + 4 }, // 대댓글 들여쓰기
      ]}
    >
      {/* LEFT: 프로필 */}
      <View style={styles.left}>
        <AppProfileImage
          imageUrl={comment.memberProfileImageUrl}
          memberId={comment.memberId}
          size={36}
        />
      </View>

      {/* CENTER: 본문 */}
      <View style={styles.center}>
        <View style={styles.headerRow}>
          <AppText style={styles.nick}>{comment.memberNickName}</AppText>
          <AppText style={styles.date}>
            {comment.createDateTime?.split('T')[0] ?? ''}
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

      {/* RIGHT: 좋아요 */}
      <View style={styles.right}>
        <ContentsHeartButton
          liked={comment.reactedByCurrentMember}
          onToggle={() => {}}
          size={18}
        />
        {comment.reactionCount > 0 && (
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

  /** LEFT */
  left: {
    width: 40,
    alignItems: 'center',
    marginRight: SPACING.xs,
    top: SPACING.xs,
  },

  /** CENTER */
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
    color: COLORS.text,
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

  /** RIGHT */
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
