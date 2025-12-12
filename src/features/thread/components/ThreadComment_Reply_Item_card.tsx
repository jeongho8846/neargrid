// 📄 src/features/thread/components/ThreadComment_Reply_Item_card.tsx
import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import AppText from '@/common/components/AppText';
import AppProfileImage from '@/common/components/AppProfileImage';
import ContentsHeartButton from '@/common/components/Contents_Heart_Button';
import { ThreadComment } from '../model/ThreadCommentModel';
import { SPACING } from '@/common/styles/spacing';
import { COLORS } from '@/common/styles/colors';
import { useCommentThreadLike } from '../hooks/useCommentThreadLike';

type Props = {
  comment: ThreadComment;
  onPressReply?: (comment: ThreadComment) => void;
  /** ✅ 어떤 리스트에서 쓰이는지 구분 */
  listType?: 'commentList' | 'replyList';
};

const ThreadReplyItem: React.FC<Props> = ({
  comment,
  onPressReply,
  listType = 'replyList',
}) => {
  const profileSize = listType === 'replyList' ? 32 : 36;
  const showReplyButton = listType === 'commentList';
  const threadId = comment.threadId ?? '';

  const { liked, likeCount, toggleLike, inflight } = useCommentThreadLike({
    threadId,
    commentThreadId: comment.commentThreadId,
    initialLiked: comment.reactedByCurrentMember,
    initialCount: comment.reactionCount,
  });

  const containerStyle =
    listType === 'replyList'
      ? [
          styles.container,
          {
            borderLeftWidth: 1,
            borderLeftColor: COLORS.border,
            marginLeft: SPACING.lg,
            paddingLeft: SPACING.sm,
          },
        ]
      : styles.container;

  return (
    <View style={containerStyle}>
      {/* 🧩 프로필 이미지 */}
      <AppProfileImage
        imageUrl={comment.memberProfileImageUrl}
        memberId={comment.memberId}
        size={profileSize}
        canGoToProfileScreen={true}
      />

      {/* 🗨️ 본문 */}
      <View style={styles.center}>
        <View style={styles.headerRow}>
          <AppText variant="username">{comment.memberNickName}</AppText>
          <AppText variant="caption">
            {comment.createDatetime ? comment.createDatetime.split('T')[0] : ''}
          </AppText>
        </View>

        <AppText variant="body">{comment.description}</AppText>

        {showReplyButton && (
          <TouchableOpacity
            activeOpacity={0.6}
            onPress={() => onPressReply?.(comment)}
          >
            <AppText variant="link" style={styles.replyBtn}>
              답글 달기
            </AppText>
          </TouchableOpacity>
        )}
      </View>

      {/* ❤️ 좋아요 버튼 */}
      <View style={styles.right}>
        <ContentsHeartButton
          liked={liked}
          onToggle={toggleLike}
          size={18}
          isLoading={inflight}
          disabled={inflight || !threadId || !comment.commentThreadId}
        />
        <View style={styles.right_text}>
          {!!likeCount && <AppText variant="caption">{likeCount}</AppText>}
        </View>
      </View>
    </View>
  );
};

export default ThreadReplyItem;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.sm,
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
  replyBtn: {
    marginTop: 4,
  },
  right: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    marginLeft: SPACING.sm,
    paddingTop: 2,
    alignSelf: 'center',
    alignContent: 'center',
  },
  right_text: {
    alignContent: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
});
