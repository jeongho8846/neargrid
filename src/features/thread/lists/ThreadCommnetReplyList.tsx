// src/features/thread/lists/ThreadCommentReplyList.tsx
import React, {
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle,
  useRef,
} from 'react';
import { View, StyleSheet } from 'react-native';
import { useQuery } from '@tanstack/react-query';
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

    // ✅ 내부 ref
    const selfRef = useRef<ThreadCommentReplyListRef>(null);

    // ✅ Optimistic state
    const [optimisticReplies, setOptimisticReplies] = useState<ThreadComment[]>(
      [],
    );

    // ✅ 서버 데이터
    const { data, isLoading, isFetching, refetch } = useQuery({
      queryKey: ['childCommentThreads', parentComment.commentThreadId ?? ''],
      queryFn: () =>
        fetchChildCommentThreads({
          threadId: parentComment.threadId ?? '',
          commentThreadId: parentComment.commentThreadId ?? '',
          currentMemberId: member?.id ?? '',
        }),
      enabled: !!member?.id && !!parentComment.commentThreadId,
      staleTime: 0,
    });

    const serverReplies = Array.isArray(data) ? data : [];

    // ✅ 병합
    const mergedReplies = [
      ...optimisticReplies.filter(
        temp =>
          !serverReplies.some(s => s.commentThreadId === temp.commentThreadId),
      ),
      ...serverReplies,
    ];

    // ✅ ref 동작 연결
    useImperativeHandle(ref ?? selfRef, () => ({
      addOptimisticComment: comment => {
        console.log('🟣 addOptimisticComment', comment);
        setOptimisticReplies(prev => [comment, ...prev]);
      },
      replaceTempComment: (tempId, newComment) => {
        console.log('🟣 replaceTempComment', tempId, newComment);
        setOptimisticReplies(prev =>
          prev.map(c => (c.commentThreadId === tempId ? newComment : c)),
        );
      },
      removeTempComment: tempId => {
        console.log('🟣 removeTempComment', tempId);
        setOptimisticReplies(prev =>
          prev.filter(c => c.commentThreadId !== tempId),
        );
      },
    }));

    // ✅ Optimistic 훅
    const { handleSubmit } = useCreateThreadCommentReplyWithOptimistic(
      parentComment.threadId ?? '',
      selfRef,
    );

    // ✅ 입력창
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
          onRefresh={refetch}
          isLoading={isLoading}
          refreshing={isFetching}
          contentContainerStyle={styles.content}
          /** ✅ 부모 댓글 + 대댓글 수 표시 */
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
