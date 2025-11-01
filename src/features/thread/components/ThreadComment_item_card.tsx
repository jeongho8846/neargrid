// 📄 src/features/thread/components/ThreadComment_item_card.tsx
import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AppText from '@/common/components/AppText';
import AppProfileImage from '@/common/components/AppProfileImage';
import ContentsHeartButton from '@/common/components/Contents_Heart_Button';
import { SPACING } from '@/common/styles/spacing';
import { AppSkeletonPreset } from '@/common/components/Skeletons';
import ThreadReplyItem from './ThreadComment_Reply_Item_card';
import { ThreadComment } from '../model/ThreadCommentModel';

type Props = {
  comment: ThreadComment;
  onPressReply?: (comment: ThreadComment) => void;
  listType?: 'commentList' | 'replyList';
};

const ThreadCommentItem: React.FC<Props> = ({
  comment,
  onPressReply,
  listType = 'commentList',
}) => {
  const navigation = useNavigation<any>();
  const isSkeleton = comment.isSkeleton === true;
  const replies = comment.initialChildCommentThreadResponseDtos ?? [];

  if (isSkeleton) {
    return (
      <View style={[styles.container, { opacity: 0.9 }]}>
        <AppSkeletonPreset type="simple" />
      </View>
    );
  }

  const handlePressComment = () => {
    navigation.navigate('DetailThreadComment', { comment });
  };

  const handlePressMoreReplies = () => {
    navigation.navigate('DetailThreadComment', { comment });
  };

  const showReplyButton = listType === 'commentList';
  const childCount = comment.childCommentThreadCount ?? 0;
  const showMoreButton =
    listType === 'commentList' && childCount > replies.length;

  const profileSize = 36;

  return (
    <View>
      {/* ✅ 댓글 본문 */}
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={handlePressComment}
        style={styles.container}
      >
        {/* 프로필 */}
        <View style={styles.left}>
          <AppProfileImage
            imageUrl={comment.memberProfileImageUrl}
            memberId={comment.memberId}
            size={profileSize}
          />
        </View>

        {/* 텍스트 */}
        <View style={styles.center}>
          <View style={styles.headerRow}>
            <AppText variant="username">{comment.memberNickName}</AppText>
          </View>

          <AppText variant="body">{comment.description}</AppText>

          {showReplyButton && (
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={() => onPressReply?.(comment)}
            >
              <AppText variant="link">답글 달기</AppText>
            </TouchableOpacity>
          )}
        </View>

        {/* 좋아요 */}
        <View style={styles.right}>
          <ContentsHeartButton
            liked={!!comment.reactedByCurrentMember}
            onToggle={() => {}}
            size={18}
          />
          {!!comment.reactionCount && (
            <AppText variant="caption">{comment.reactionCount}</AppText>
          )}
        </View>
      </TouchableOpacity>

      {/* ✅ 내부 대댓글 미리보기 */}
      {listType === 'commentList' && replies.length > 0 && (
        <View style={styles.childContainer}>
          <AppText
            variant="caption"
            style={{ marginBottom: SPACING.sm, marginLeft: SPACING.lg }}
          >
            대댓글 {comment.childCommentThreadCount ?? replies.length}개
          </AppText>

          {replies.map(reply => (
            <ThreadReplyItem
              key={reply.commentThreadId}
              comment={reply}
              listType="replyList"
              onPressReply={onPressReply}
            />
          ))}

          {showMoreButton && (
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={handlePressMoreReplies}
            >
              <AppText
                variant="link"
                style={{ marginTop: 6, marginLeft: SPACING.lg }}
              >
                댓글 더보기
              </AppText>
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
  },
  right: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    marginLeft: SPACING.sm,
    paddingTop: 2,
    alignSelf: 'stretch',
  },
  childContainer: {
    marginTop: SPACING.xs,
    marginBottom: SPACING.sm,
  },
});
