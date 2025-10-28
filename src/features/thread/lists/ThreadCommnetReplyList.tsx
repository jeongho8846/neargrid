import React, { useEffect, useState, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { ThreadComment } from '../model/ThreadCommentModel';
import AppFlatList from '@/common/components/AppFlatList/AppFlatList';
import ThreadReplyItem from '../components/ThreadComment_Reply_Item_card';
import ThreadCommentItem from '../components/ThreadComment_item_card';
import { SPACING } from '@/common/styles/spacing';
import { COLORS } from '@/common/styles/colors';
import { FONT } from '@/common/styles/typography';
import AppText from '@/common/components/AppText';
import { fetchChildCommentThreads } from '../api/fetchChildCommentThreads';
import { useCurrentMember } from '@/features/member/hooks/useCurrentMember';

type Props = {
  parentComment: ThreadComment;
};

const ThreadReplyList: React.FC<Props> = ({ parentComment }) => {
  const { member } = useCurrentMember();
  const [replies, setReplies] = useState<ThreadComment[]>([]);
  const [loading, setLoading] = useState(false);

  /** ✅ API 호출 함수 */
  const loadReplies = useCallback(async () => {
    if (!member?.id) return; // member.id 없으면 skip
    try {
      setLoading(true);
      const res = await fetchChildCommentThreads({
        threadId: parentComment.threadId!,
        commentThreadId: parentComment.commentThreadId,
        currentMemberId: member.id,
      });
      setReplies(res.childCommentThreadResponseDtos ?? []);
    } catch (err) {
      console.warn('❌ 대댓글 불러오기 실패:', err);
    } finally {
      setLoading(false);
    }
  }, [member?.id, parentComment]);

  /** ✅ 최초 실행 */
  useEffect(() => {
    loadReplies();
  }, [loadReplies]);

  return (
    <View style={styles.container}>
      <AppFlatList
        data={replies}
        keyExtractor={item => String(item.commentThreadId)}
        renderItem={({ item }) => <ThreadReplyItem comment={item} />}
        refreshing={loading}
        onRefresh={loadReplies}
        /** ✅ 부모 댓글 + 대댓글 수량 표시 */
        ListHeaderComponent={
          <View>
            <View style={styles.parentBox}>
              <ThreadCommentItem comment={parentComment} listType="replyList" />
            </View>
            <View style={styles.headerDivider}>
              <AppText style={styles.replyCount}>
                대댓글 {replies.length}개
              </AppText>
            </View>
          </View>
        }
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

export default ThreadReplyList;

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 60 },
  headerDivider: {
    marginTop: SPACING.md,
    marginBottom: SPACING.md,
    alignItems: 'flex-start',
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
  },
  replyCount: {
    marginVertical: 6,
    ...FONT.body,
    color: COLORS.text,
  },
  parentBox: {},
  listContent: { paddingBottom: SPACING.xl * 2 },
});
