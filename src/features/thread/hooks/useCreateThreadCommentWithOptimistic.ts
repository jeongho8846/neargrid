import { useRef } from 'react';
import { createThreadComment } from '../api/createThreadComment';
import { useQueryClient } from '@tanstack/react-query';
import { useCurrentMember } from '@/features/member/hooks/useCurrentMember';
import { ThreadCommentListRef } from '../lists/ThreadCommentList';

export function useCreateThreadCommentWithOptimistic(
  threadId: string,
  commentListRef: React.RefObject<ThreadCommentListRef | null>,
) {
  const { member } = useCurrentMember();
  const isSubmittingRef = useRef(false);
  const queryClient = useQueryClient();

  const handleSubmit = async (text: string) => {
    if (isSubmittingRef.current) return;
    isSubmittingRef.current = true;

    let tempId = '';

    try {
      if (!member?.id) throw new Error('로그인이 필요합니다.');

      tempId = `temp-${Date.now()}`;
      const now = new Date().toISOString();

      // ✅ 1️⃣ Optimistic 임시 댓글
      const tempComment = {
        commentThreadId: tempId,
        threadId,
        description: text,
        depth: 0,
        memberId: member.id,
        memberNickName: member.nickname,
        memberProfileImageUrl: member.profileImageUrl ?? '',
        reactionCount: 0,
        reactedByCurrentMember: false,
        isPending: true,
        createDatetime: now,
      };

      commentListRef.current?.addOptimisticComment(tempComment);

      // ✅ 2️⃣ 캐시에서도 댓글 수량 +1 (thread, threads 모두)
      queryClient.setQueryData(['thread', threadId], (prev: any) =>
        prev
          ? { ...prev, commentThreadCount: (prev.commentThreadCount ?? 0) + 1 }
          : prev,
      );

      queryClient.setQueriesData({ queryKey: ['threads'] }, (old: any) => {
        if (!old) return old;
        return {
          ...old,
          pages: old.pages.map((page: any) => ({
            ...page,
            threads: page.threads.map((t: any) =>
              t.threadId === threadId
                ? {
                    ...t,
                    commentThreadCount: (t.commentThreadCount ?? 0) + 1,
                  }
                : t,
            ),
          })),
        };
      });

      // ✅ 3️⃣ 서버 요청
      const real = await createThreadComment({
        threadId,
        description: text,
      });

      // ✅ 4️⃣ 서버 응답으로 교체
      commentListRef.current?.replaceTempComment(tempId, {
        ...real,
        isPending: false,
      });
    } catch (e) {
      console.warn('댓글 작성 실패:', e);
      commentListRef.current?.removeTempComment(tempId);
    } finally {
      isSubmittingRef.current = false;
    }
  };

  return { handleSubmit };
}
