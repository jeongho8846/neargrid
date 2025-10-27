import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import AppText from '@/common/components/AppText';
import AppProfileImage from '@/common/components/AppProfileImage';
import { ThreadComment } from '../model/ThreadCommentModel';
import ContentsHeartButton from '@/common/components/Contents_Heart_Button';
import { COLORS } from '@/common/styles/colors';
import { FONT } from '@/common/styles/typography';
import { SPACING } from '@/common/styles/spacing';
import { AppSkeletonPreset } from '@/common/components/Skeletons';

type Props = {
  comment: ThreadComment;
  onPressReply?: (comment: ThreadComment) => void;
  onPressMoreReplies?: (parentId: string) => void; // ✅ “댓글 더보기” 버튼 클릭용
};

const ThreadCommentItem: React.FC<Props> = ({
  comment,
  onPressReply,
  onPressMoreReplies,
}) => {
  const isChild = comment.depth > 0;
  const isSkeleton = comment.isSkeleton === true;
  const replies = comment.initialChildCommentThreadResponseDtos ?? [];

  if (isSkeleton) {
    return (
      <View style={[styles.container, { opacity: 0.9 }]}>
        <AppSkeletonPreset type="simple" />
      </View>
    );
  }

  return (
    <View>
      {/* ✅ 부모 댓글 */}
      <View style={[styles.container]}>
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
            {isChild ? null : (
              <AppText style={styles.replyBtn}>답글 달기</AppText>
            )}
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

      {/* ✅ 대댓글 목록 (최대 3개 표시) */}
      {replies.length > 0 && (
        <View style={styles.childContainer}>
          {/* 🔹 대댓글 개수 표시 */}
          <AppText
            color="text_secondary"
            style={{ marginBottom: SPACING.sm, marginLeft: SPACING.sm }}
          >
            대댓글 {comment.childCommentThreadCount ?? replies.length}개
          </AppText>

          {replies.map(reply => (
            <ThreadCommentItem
              key={reply.commentThreadId}
              comment={{ ...reply, depth: 1 }}
              onPressReply={onPressReply}
            />
          ))}

          {/* ✅ “댓글 더보기 (n)” */}
          {comment.childCommentThreadCount > replies.length && (
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => onPressMoreReplies?.(comment.commentThreadId)}
            >
              <AppText style={styles.moreReplies}>댓글 더보기</AppText>
            </TouchableOpacity>
          )}
        </View>
      )}
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

  /** ✅ 대댓글 부분 */
  childContainer: {
    marginTop: SPACING.xs,
    marginBottom: SPACING.sm,
    borderLeftWidth: 1,
    borderLeftColor: COLORS.border,
    marginLeft: SPACING.lg,
    paddingLeft: -20,
  },
  moreReplies: {
    ...FONT.caption,
    color: COLORS.text_secondary,
    marginTop: 6,
    paddingLeft: SPACING.sm,
  },
});
