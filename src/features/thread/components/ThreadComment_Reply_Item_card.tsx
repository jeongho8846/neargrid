import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import AppText from '@/common/components/AppText';
import AppProfileImage from '@/common/components/AppProfileImage';
import ContentsHeartButton from '@/common/components/Contents_Heart_Button';
import { ThreadComment } from '../model/ThreadCommentModel';
import { COLORS } from '@/common/styles/colors';
import { FONT } from '@/common/styles/typography';
import { SPACING } from '@/common/styles/spacing';

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
  const showReplyButton = listType === 'commentList'; // ✅ 댓글 리스트일 때만 표시

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
      <AppProfileImage
        imageUrl={comment.memberProfileImageUrl}
        memberId={comment.memberId}
        size={profileSize}
      />

      <View style={styles.center}>
        <View style={styles.headerRow}>
          <AppText style={styles.nick}>{comment.memberNickName}</AppText>
          <AppText style={styles.date}>
            {comment.createDatetime ? comment.createDatetime.split('T')[0] : ''}
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
});
