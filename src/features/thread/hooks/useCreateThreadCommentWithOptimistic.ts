// src/features/thread/hooks/useCreateThreadCommentWithOptimistic.ts
import { useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { createThreadComment } from '../api/createThreadComment';
import { useCurrentMember } from '@/features/member/hooks/useCurrentMember';
import { ThreadCommentListRef } from '../lists/ThreadCommentList';
import { updateThreadCommentCountCache } from '../utils/updateThreadCommentCountCache';

/**
 * ✅ 댓글 생성 훅 (Optimistic + 캐시 갱신)
 */
export function useCreateThreadCommentWithOptimistic(
  threadId: string,
  commentListRef: React.RefObject<ThreadCommentListRef | null>,
) {
  const { member } = useCurrentMember();
  const queryClient = useQueryClient();
  const isSubmittingRef = useRef(false);

  const handleSubmit = async (text: string) => {
    if (isSubmittingRef.current) return;
    isSubmittingRef.current = true;

    let tempId = '';

    try {
      if (!member?.id) throw new Error('로그인이 필요합니다.');

      tempId = `temp-${Date.now()}`;
      const now = new Date().toISOString();

      // ✅ 1️⃣ 임시 댓글 추가
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

      // ✅ 2️⃣ 캐시(commentThreadCount) +1
      updateThreadCommentCountCache(queryClient, threadId, +1);

      // ✅ 3️⃣ 서버 요청
      const real = await createThreadComment({ threadId, description: text });

      // ✅ 4️⃣ 성공 시 임시 댓글 교체
      commentListRef.current?.replaceTempComment(tempId, {
        ...real,
        isPending: false,
      });
    } catch (e) {
      console.warn('❌ 댓글 작성 실패:', e);

      // ❌ 실패 시 롤백
      updateThreadCommentCountCache(queryClient, threadId, -1);
      commentListRef.current?.removeTempComment(tempId);
    } finally {
      isSubmittingRef.current = false;
    }
  };

  return { handleSubmit };
}
