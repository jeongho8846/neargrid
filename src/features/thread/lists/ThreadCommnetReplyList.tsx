// src/features/thread/lists/ThreadCommentReplyList.tsx
import React, {
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle,
  useRef,
} from 'react';
import { View, StyleSheet } from 'react-native';
import { fetchChildCommentThreads } from '../api/fetchChildCommentThreads';
import { ThreadComment } from '../model/ThreadCommentModel';
import AppFlatList from '@/common/components/AppFlatList/AppFlatList';
import ThreadCommentReplyItem from '../components/ThreadComment_Reply_Item_card';
import ThreadCommentItem from '../components/ThreadComment_item_card';
import { useCurrentMember } from '@/features/member/hooks/useCurrentMember';
import { useGlobalInputBarStore } from '@/common/state/globalInputBarStore';
import { useCreateThreadCommentReplyWithOptimistic } from '../hooks/useCreateThreadCommentReplyWithOptimistic';
import { COLORS } from '@/common/styles/colors';
import { SPACING } from '@/common/styles/spacing';
import AppText from '@/common/components/AppText';
import { FONT } from '@/common/styles/typography';

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
    const openInputBar = useGlobalInputBarStore(s => s.open);
    const closeInputBar = useGlobalInputBarStore(s => s.close);

    const selfRef = useRef<ThreadCommentReplyListRef>(null);

    /** ✅ Optimistic 로컬 상태 */
    const [optimisticReplies, setOptimisticReplies] = useState<ThreadComment[]>(
      [],
    );
    const [serverReplies, setServerReplies] = useState<ThreadComment[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);

    /** ✅ 서버 데이터 직접 fetch */
    const loadReplies = async () => {
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
        console.warn('❌ [ThreadCommentReplyList] 대댓글 불러오기 실패:', e);
      } finally {
        setIsLoading(false);
      }
    };

    /** ✅ 새로고침 */
    const handleRefresh = async () => {
      if (isRefreshing) return;
      setIsRefreshing(true);
      await loadReplies();
      setIsRefreshing(false);
    };

    /** ✅ 초기 로드 */
    useEffect(() => {
      loadReplies();
    }, [parentComment.commentThreadId, member?.id]);

    /** ✅ 병합된 리스트 */
    const mergedReplies = [
      ...optimisticReplies.filter(
        temp =>
          !serverReplies.some(s => s.commentThreadId === temp.commentThreadId),
      ),
      ...serverReplies,
    ];

    /** ✅ Ref 제어 메서드 */
    useImperativeHandle(ref ?? selfRef, () => ({
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

    /** ✅ Optimistic 훅 */
    const { handleSubmit } = useCreateThreadCommentReplyWithOptimistic(
      parentComment.threadId ?? '',
      selfRef,
    );

    /** ✅ 입력창 */
    useEffect(() => {
      openInputBar({
        placeholder: '답글을 입력하세요…',
        isFocusing: false,
        onSubmit: text =>
          handleSubmit(text, parentComment.commentThreadId ?? ''),
      });
      return () => closeInputBar();
    }, [
      openInputBar,
      closeInputBar,
      handleSubmit,
      parentComment.commentThreadId,
    ]);

    return (
      <View style={styles.container}>
        <AppFlatList
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
              {/* ✅ 부모 댓글 */}
              <View style={styles.parentBox}>
                <ThreadCommentItem
                  comment={parentComment}
                  listType="replyList"
                />
              </View>

              {/* ✅ 구분선 + 대댓글 개수 */}
              <View style={styles.headerDivider}>
                <AppText style={styles.replyCount}>
                  대댓글 {mergedReplies.length}개
                </AppText>
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
  container: { flex: 1, backgroundColor: COLORS.background, paddingTop: 60 },
  parentBox: {},
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
  content: { paddingBottom: SPACING.xl * 3 },
});
