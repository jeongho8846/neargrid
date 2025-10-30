// src/features/thread/hooks/useCreateThreadCommentReplyWithOptimistic.ts
import { useRef } from 'react';
import { createThreadComment } from '../api/createThreadComment';
import { ThreadCommentListRef } from '../lists/ThreadCommentList';
import { useCurrentMember } from '@/features/member/hooks/useCurrentMember';
import { ThreadComment } from '../model/ThreadCommentModel';

/**
 * ✅ 대댓글 생성 훅 (쿼리 캐시 제거 버전)
 * - Optimistic 처리 없이 직접 API 호출 + 리스트 Ref 갱신만 수행
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
    const now = new Date().toISOString();

    try {
      if (!member?.id) throw new Error('로그인이 필요합니다.');

      tempId = `temp-${Date.now()}`;

      // ✅ 임시 대댓글 추가
      const tempReply: ThreadComment = {
        commentThreadId: tempId,
        threadId,
        description: text,
        depth: 1,
        parentCommentThreadId,
        memberId: member.id,
        memberNickName: member.nickname,
        memberProfileImageUrl: member.profileImageUrl ?? '',
        reactionCount: 0,
        reactedByCurrentMember: false,
        isPending: true,
        createDatetime: now,
      } as any;

      commentListRef?.current?.addOptimisticComment(tempReply);

      // ✅ 서버 요청
      const real = await createThreadComment({
        threadId,
        description: text,
        parentCommentThreadId,
      });

      // ✅ 실제 응답 교체
      const realReply: ThreadComment = {
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
      } as any;

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
