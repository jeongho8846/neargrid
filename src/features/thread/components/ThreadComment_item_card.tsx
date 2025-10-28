import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AppText from '@/common/components/AppText';
import AppProfileImage from '@/common/components/AppProfileImage';
import { ThreadComment } from '../model/ThreadCommentModel';
import ContentsHeartButton from '@/common/components/Contents_Heart_Button';
import { COLORS } from '@/common/styles/colors';
import { FONT } from '@/common/styles/typography';
import { SPACING } from '@/common/styles/spacing';
import { AppSkeletonPreset } from '@/common/components/Skeletons';
import ThreadReplyItem from './ThreadComment_Reply_Item_card';

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
  const profileSize = listType === 'replyList' ? 32 : 36;

  return (
    <View>
      {/* ✅ 부모 댓글 */}
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={handlePressComment}
        style={[styles.container]}
      >
        <View style={styles.left}>
          <AppProfileImage
            imageUrl={comment.memberProfileImageUrl}
            memberId={comment.memberId}
            size={profileSize}
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

          {showReplyButton && (
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={() => onPressReply?.(comment)}
            >
              <AppText style={styles.replyBtn}>답글 달기</AppText>
            </TouchableOpacity>
          )}
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
      </TouchableOpacity>

      {/* ✅ 내부 대댓글 표시 */}
      {listType === 'commentList' && replies.length > 0 && (
        <View style={styles.childContainer}>
          <AppText
            color="text_secondary"
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
    alignItems: 'flex-end',
    justifyContent: 'center', // ✅ 위쪽 정렬에서 아래쪽으로 바꾸기
    marginLeft: SPACING.sm,
    paddingTop: 2, // ✅ 약간 아래로 내려줌
    alignSelf: 'stretch', // ✅ 부모 높이 100%
  },

  likeCount: {
    ...FONT.caption,
    color: COLORS.text,
    marginLeft: 4,
  },
  childContainer: {
    marginTop: SPACING.xs,
    marginBottom: SPACING.sm,
  },
  moreReplies: {
    ...FONT.body,
    color: COLORS.text_secondary,
    marginTop: 6,
    marginLeft: SPACING.lg,
  },
});
