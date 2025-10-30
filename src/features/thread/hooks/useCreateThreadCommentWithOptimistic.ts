// src/features/thread/hooks/useCreateThreadCommentWithOptimistic.ts
import { useRef } from 'react';
import { createThreadComment } from '../api/createThreadComment';
import { useCurrentMember } from '@/features/member/hooks/useCurrentMember';
import { ThreadCommentListRef } from '../lists/ThreadCommentList';

/**
 * ✅ 댓글 생성 훅 (쿼리 캐시 제거 버전)
 * - React Query 캐시 수정 제거
 * - 리스트 ref만 이용해 Optimistic UI 처리
 */
export function useCreateThreadCommentWithOptimistic(
  threadId: string,
  commentListRef: React.RefObject<ThreadCommentListRef | null>,
) {
  const { member } = useCurrentMember();
  const isSubmittingRef = useRef(false);

  const handleSubmit = async (text: string) => {
    if (isSubmittingRef.current) return;
    isSubmittingRef.current = true;

    let tempId = '';

    try {
      if (!member?.id) throw new Error('로그인이 필요합니다.');

      tempId = `temp-${Date.now()}`;
      const now = new Date().toISOString();

      // ✅ 임시 댓글 추가 (Optimistic)
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

      // ✅ 서버 요청
      const real = await createThreadComment({
        threadId,
        description: text,
      });

      // ✅ 성공 시 임시 댓글 교체
      commentListRef.current?.replaceTempComment(tempId, {
        ...real,
        isPending: false,
      });
    } catch (e) {
      console.warn('❌ 댓글 작성 실패:', e);
      commentListRef.current?.removeTempComment(tempId);
    } finally {
      isSubmittingRef.current = false;
    }
  };

  return { handleSubmit };
}
