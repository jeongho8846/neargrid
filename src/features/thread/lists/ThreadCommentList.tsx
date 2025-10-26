// src/features/thread/lists/ThreadCommentList.tsx
import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import ThreadCommentItem from '../components/ThreadComment_item_card';
import { fetchThreadComments } from '../api/fetchThreadComments';
import { ThreadComment } from '../model/ThreadCommentModel';
import { useCurrentMember } from '@/features/member/hooks/useCurrentMember';
import AppText from '@/common/components/AppText';
import AppFlatList from '@/common/components/AppFlatList/AppFlatList';

export type ThreadCommentListRef = {
  addOptimisticComment: (comment: ThreadComment) => void;
  replaceTempComment: (tempId: string, newComment: ThreadComment) => void;
  removeTempComment: (tempId: string) => void;
};

type Props = {
  threadId: string;
};

const ThreadCommentList = forwardRef<ThreadCommentListRef, Props>(
  ({ threadId }, ref) => {
    const { member } = useCurrentMember();
    const queryClient = useQueryClient();

    // ✅ 댓글 리스트 쿼리
    const {
      data: comments = [],
      isLoading,
      isFetching,
    } = useQuery({
      queryKey: ['threadComments', threadId],
      queryFn: () =>
        fetchThreadComments({
          threadId,
          currentMemberId: member?.id ?? '',
        }).then(res => res.commentThreadResponseDtos || []),
      enabled: !!member,
      staleTime: 1000 * 60 * 3, // 3분 동안 캐시 신선하게 유지
      gcTime: 1000 * 60 * 10, // 10분 후 캐시 제거
    });

    // ✅ 낙관적 업데이트용 로컬 상태
    const [optimisticComments, setOptimisticComments] = useState<
      ThreadComment[]
    >([]);

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

    // ✅ 스켈레톤용 더미 데이터 (5개)
    const skeletons: ThreadComment[] = Array.from({ length: 5 }, (_, i) => ({
      commentThreadId: `skeleton-${i}`,
      description: '',
      memberNickName: '',
      memberProfileImageUrl: '',
      createDatetime: '',
      isSkeleton: true, // ThreadCommentItem에서 이 값으로 스켈레톤 처리
    }));

    // ✅ 최종 데이터 병합
    const mergedComments = isLoading
      ? skeletons // 로딩 중일 때는 스켈레톤 표시
      : [...optimisticComments, ...(comments ?? [])];

    // ✅ 데이터 없음 (로딩 X + 빈 배열)
    if (!isLoading && mergedComments.length === 0) {
      return (
        <View style={styles.empty}>
          <AppText>아직 댓글이 없습니다.</AppText>
        </View>
      );
    }

    return (
      <AppFlatList
        data={mergedComments}
        keyExtractor={item => item.commentThreadId}
        renderItem={({ item }) => <ThreadCommentItem comment={item} />}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshing={isFetching}
        onRefresh={() =>
          queryClient.invalidateQueries({
            queryKey: ['threadComments', threadId],
          })
        }
      />
    );
  },
);

const styles = StyleSheet.create({
  empty: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
    width: '100%',
  },
  listContent: {
    paddingBottom: 80,
  },
});

export default ThreadCommentList;
