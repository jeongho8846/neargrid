// src/features/thread/hooks/useCreateThreadCommentReplyWithOptimistic.ts
import { useRef } from 'react';
import { createThreadComment } from '../api/createThreadComment';
import { ThreadCommentListRef } from '../lists/ThreadCommentList';
import { useCurrentMember } from '@/features/member/hooks/useCurrentMember';
import { updateThreadCommentCountCache } from '../utils/updateThreadCommentCountCache';

/**
 * ✅ 대댓글 Optimistic 생성 훅
 * - 댓글 버전(useCreateThreadCommentWithOptimistic)과 동일한 구조로 통일
 * - tempReply / realReply 두 단계로 구분
 */
export function useCreateThreadCommentReplyWithOptimistic(
  threadId: string,
  commentListRef?: React.RefObject<ThreadCommentListRef | null>,
) {
  const { member } = useCurrentMember();
  const isSubmittingRef = useRef(false);

  const handleSubmit = async (text: string, parentCommentThreadId: string) => {
    if (isSubmittingRef.current) return;
    isSubmittingRef.current = true;

    let tempId = '';

    try {
      if (!member?.id) throw new Error('로그인이 필요합니다.');

      tempId = `temp-${Date.now()}`;
      const now = new Date().toISOString();

      // ✅ 1️⃣ Optimistic 임시 대댓글
      const tempReply = {
        commentThreadId: tempId,
        threadId,
        description: text,
        depth: 1,
        likeCount: 0,
        likedByMe: false,
        parentCommentThreadId,
        memberId: member.id,
        memberNickName: member.nickname,
        memberProfileImageUrl: member.profileImageUrl ?? '',
        reactionCount: 0,
        reactedByCurrentMember: false,
        isPending: true,
        createDatetime: now,
      };

      commentListRef?.current?.addOptimisticComment(tempReply);
      updateThreadCommentCountCache(threadId);

      // ✅ 2️⃣ 실제 서버 요청
      const real = await createThreadComment({
        threadId,
        description: text,
        parentCommentThreadId,
      });

      // ✅ 3️⃣ 서버 응답을 동일한 구조로 정리
      const realReply = {
        commentThreadId: real.commentThreadId,
        threadId: real.threadId,
        description: real.description,
        depth: real.depth ?? 1,
        parentCommentThreadId:
          real.parentCommentThreadId ?? parentCommentThreadId,
        memberId: real.memberId ?? member.id,
        memberNickName: real.memberNickName ?? member.nickname,
        memberProfileImageUrl:
          real.memberProfileImageUrl ?? member.profileImageUrl,
        reactionCount: real.reactionCount ?? 0,
        reactedByCurrentMember: real.reactedByCurrentMember ?? false,
        isPending: false,
        createDatetime: real.createDatetime ?? now,
      };

      // ✅ 4️⃣ 임시 → 실제로 교체
      commentListRef?.current?.replaceTempComment(tempId, realReply);
    } catch (err) {
      console.warn(
        '❌ [useCreateThreadCommentReplyWithOptimistic] 대댓글 작성 실패:',
        err,
      );
      commentListRef?.current?.removeTempComment(tempId);
    } finally {
      isSubmittingRef.current = false;
    }
  };

  return { handleSubmit };
}
