// 📄 src/features/thread/lists/ThreadCommentReplyList.tsx
import React, {
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle,
  useCallback,
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
    const openInputBar = useGlobalInputBarStore(s => s.open);
    const closeInputBar = useGlobalInputBarStore(s => s.close);

    /** 🔧 내부용 ref (hook에 넘겨줄 때 ForwardedRef 말고 RefObject 필요) */
    const innerRef = useRef<ThreadCommentReplyListRef>(null);

    const [optimisticReplies, setOptimisticReplies] = useState<ThreadComment[]>(
      [],
    );
    const [serverReplies, setServerReplies] = useState<ThreadComment[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);

    /** ✅ 서버 데이터 fetch (useCallback으로 감싸서 eslint 만족) */
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

    /** 🔄 새로고침 */
    const handleRefresh = useCallback(async () => {
      if (isRefreshing) return;
      setIsRefreshing(true);
      await loadReplies();
      setIsRefreshing(false);
    }, [isRefreshing, loadReplies]);

    /** ⏳ 초기 로드 */
    useEffect(() => {
      loadReplies();
    }, [loadReplies]);

    /** 🧠 병합된 리스트 */
    const mergedReplies = [
      ...optimisticReplies.filter(
        temp =>
          !serverReplies.some(s => s.commentThreadId === temp.commentThreadId),
      ),
      ...serverReplies,
    ];

    /** 🔧 외부에서 제어할 메서드 */
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

    /** 💬 Optimistic 댓글 등록 훅
     * 이 훅이 RefObject<T>를 기대하고 있는데,
     * forwardRef로 받은 ref는 ForwardedRef<T>라서 타입이 안 맞았던 거야.
     * 그래서 innerRef 만들어서 이걸 넘김.
     */
    const { handleSubmit } = useCreateThreadCommentReplyWithOptimistic(
      parentComment.threadId ?? '',
      innerRef,
    );

    /** 🧭 입력창 제어 */
    useEffect(() => {
      openInputBar({
        // NOTE: 지금 store 타입이 placeholderKey를 안 받는다 했지?
        // 그래서 일단 i18n 키 문자열을 placeholder에 넣어두고,
        // 내부에서 이걸 key로 처리하도록 나중에 store 쪽에서만 바꾸면 돼.
        placeholder: 'STR_PLACEHOLDER_REPLY',
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
              <View style={styles.parentBox}>
                <ThreadCommentItem
                  comment={parentComment}
                  listType="replyList"
                />
              </View>

              <View style={styles.headerDivider}>
                {/* ✅ 번역 */}
                <AppText i18nKey="STR_REPLY_COUNT" variant="body" />
                {/* ✅ 데이터 */}
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
    paddingTop: 56, // ⚙️ 공통 헤더 높이로 통일 예정
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
