// 📄 src/features/thread/lists/ThreadCommentReplyList.tsx
import React, {
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle,
  useCallback,
} from 'react';
import { View, StyleSheet } from 'react-native';
import { fetchChildCommentThreads } from '../api/fetchChildCommentThreads';
import { ThreadComment } from '../model/ThreadCommentModel';
import AppFlashList from '@/common/components/AppFlashList/AppFlashList';
import ThreadCommentReplyItem from '../components/ThreadComment_Reply_Item_card';
import ThreadCommentItem from '../components/ThreadComment_item_card';
import { useCurrentMember } from '@/features/member/hooks/useCurrentMember';
import AppText from '@/common/components/AppText';
import { COLORS } from '@/common/styles/colors';
import { SPACING } from '@/common/styles/spacing';

export type ThreadCommentReplyListRef = {
  addOptimisticComment: (comment: ThreadComment) => void;
  replaceTempComment: (tempId: string, newComment: ThreadComment) => void;
  removeTempComment: (tempId: string) => void;
};

type Props = {
  parentComment: ThreadComment;
};

const ThreadCommentReplyList = forwardRef<ThreadCommentReplyListRef, Props>(
  ({ parentComment }, ref) => {
    const { member } = useCurrentMember();

    // ❌ 제거: useGlobalInputBarStore 관련 코드
    // ❌ 제거: useCreateThreadCommentReplyWithOptimistic 훅

    const [optimisticReplies, setOptimisticReplies] = useState<ThreadComment[]>(
      [],
    );
    const [serverReplies, setServerReplies] = useState<ThreadComment[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const loadReplies = useCallback(async () => {
      if (!member?.id || !parentComment.commentThreadId) return;
      try {
        setIsLoading(true);
        const data = await fetchChildCommentThreads({
          threadId: parentComment.threadId ?? '',
          commentThreadId: parentComment.commentThreadId ?? '',
          currentMemberId: member.id,
        });
        setServerReplies(Array.isArray(data) ? data : []);
      } catch (e) {
        console.warn('❌ [ThreadCommentReplyList] fetch 실패:', e);
      } finally {
        setIsLoading(false);
      }
    }, [member?.id, parentComment.commentThreadId, parentComment.threadId]);

    const handleRefresh = useCallback(async () => {
      if (isRefreshing) return;
      setIsRefreshing(true);
      await loadReplies();
      setIsRefreshing(false);
    }, [isRefreshing, loadReplies]);

    useEffect(() => {
      loadReplies();
    }, [loadReplies]);

    const mergedReplies = [
      ...optimisticReplies.filter(
        temp =>
          !serverReplies.some(s => s.commentThreadId === temp.commentThreadId),
      ),
      ...serverReplies,
    ];

    useImperativeHandle(ref, () => ({
      addOptimisticComment: comment => {
        setOptimisticReplies(prev => [comment, ...prev]);
      },
      replaceTempComment: (tempId, newComment) => {
        setOptimisticReplies(prev =>
          prev.map(c => (c.commentThreadId === tempId ? newComment : c)),
        );
      },
      removeTempComment: tempId => {
        setOptimisticReplies(prev =>
          prev.filter(c => c.commentThreadId !== tempId),
        );
      },
    }));

    // ❌ 제거: useEffect로 입력창 제어하던 코드

    return (
      <View style={styles.container}>
        <AppFlashList
          data={mergedReplies}
          keyExtractor={(item, index) =>
            item.commentThreadId ?? `temp-${index}`
          }
          renderItem={({ item }) => (
            <ThreadCommentReplyItem comment={item} listType="replyList" />
          )}
          onRefresh={handleRefresh}
          isLoading={isLoading}
          refreshing={isRefreshing}
          contentContainerStyle={styles.content}
          ListHeaderComponent={
            <View>
              <View style={styles.parentBox}>
                <ThreadCommentItem
                  comment={parentComment}
                  listType="replyList"
                />
              </View>

              <View style={styles.headerDivider}>
                <AppText i18nKey="STR_REPLY_COUNT" variant="body" />
                <AppText variant="body">{mergedReplies.length}</AppText>
              </View>
            </View>
          }
        />
      </View>
    );
  },
);

ThreadCommentReplyList.displayName = 'ThreadCommentReplyList';
export default ThreadCommentReplyList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingTop: 56,
  },
  parentBox: {},
  headerDivider: {
    gap: SPACING.xs,
    flexDirection: 'row',
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
  content: {
    paddingBottom: SPACING.xl * 3,
  },
});
