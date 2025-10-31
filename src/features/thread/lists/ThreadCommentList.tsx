import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import ThreadCommentItem from '../components/ThreadComment_item_card';
import ThreadItemDetail from '../components/thread_item_detail';
import { Thread } from '../model/ThreadModel';
import { ThreadComment } from '../model/ThreadCommentModel';
import { useCurrentMember } from '@/features/member/hooks/useCurrentMember';
import { useThreadQuery } from '../hooks/useThreadQuery';
import { useFetchThreadComments } from '../hooks/useFetchThreadComments';
import AppText from '@/common/components/AppText';
import AppFlatList from '@/common/components/AppFlatList/AppFlatList';
import { SPACING } from '@/common/styles/spacing';
import { COLORS } from '@/common/styles';
import { FONT } from '@/common/styles';

export type ThreadCommentListRef = {
  addOptimisticComment: (comment: ThreadComment) => void;
  replaceTempComment: (tempId: string, newComment: ThreadComment) => void;
  removeTempComment: (tempId: string) => void;
};

type Props = {
  threadId: string;
  headerThread?: Thread | null;
  style?: object;
};

const ThreadCommentList = forwardRef<ThreadCommentListRef, Props>(
  ({ threadId, headerThread, style }, ref) => {
    const { member } = useCurrentMember();
    const { data: thread } = useThreadQuery(threadId);

    /** ✅ React Query 기반 댓글 캐시 */
    const {
      data: comments = [],
      isLoading,
      refetch,
      isFetching,
    } = useFetchThreadComments(threadId, member?.id);

    /** ✅ Optimistic 전용 로컬 리스트 */
    const [optimisticComments, setOptimisticComments] = useState<
      ThreadComment[]
    >([]);

    /** ✅ Imperative 핸들러 등록 */
    useImperativeHandle(ref, () => ({
      addOptimisticComment: comment => {
        setOptimisticComments(prev => [comment, ...prev]);
      },
      replaceTempComment: (tempId, newComment) => {
        setOptimisticComments(prev =>
          prev.map(c => (c.commentThreadId === tempId ? newComment : c)),
        );
      },
      removeTempComment: tempId => {
        setOptimisticComments(prev =>
          prev.filter(c => c.commentThreadId !== tempId),
        );
      },
    }));

    const mergedComments = [...optimisticComments, ...comments];
    const isEmpty = !isLoading && mergedComments.length === 0;
    const displayCount = thread?.commentThreadCount ?? mergedComments.length;

    return (
      <View style={styles.container}>
        <AppFlatList
          data={mergedComments}
          style={style}
          keyExtractor={item => item.commentThreadId}
          renderItem={({ item }) => (
            <ThreadCommentItem comment={item} listType="commentList" />
          )}
          isLoading={isLoading}
          refreshing={isFetching}
          onRefresh={refetch}
          renderSkeletonItem={({ index }) => (
            <ThreadCommentItem
              comment={{
                commentThreadId: `skeleton-${index}`,
                description: '',
                memberNickName: '',
                memberProfileImageUrl: '',
                createDatetime: '',
                isSkeleton: true,
              }}
            />
          )}
          skeletonCount={5}
          ListHeaderComponent={
            headerThread ? (
              <View>
                <ThreadItemDetail item={headerThread} />
                <View style={styles.headerDivider}>
                  <AppText style={styles.commentCount}>
                    댓글 {displayCount}개
                  </AppText>
                </View>
              </View>
            ) : null
          }
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            isEmpty ? (
              <View style={styles.empty}>
                <AppText>아직 댓글이 없습니다.</AppText>
              </View>
            ) : null
          }
        />
      </View>
    );
  },
);

export default ThreadCommentList;

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 60 },
  empty: { alignItems: 'center', justifyContent: 'center', width: '100%' },
  listContent: { paddingBottom: SPACING.xl * 3 },
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
  commentCount: {
    marginVertical: 6,
    ...FONT.body,
    color: COLORS.text,
  },
});
