// src/features/thread/hooks/useCreateThreadCommentReplyWithOptimistic.ts
import { useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { createThreadComment } from '../api/createThreadComment';
import { ThreadCommentListRef } from '../lists/ThreadCommentList';
import { useCurrentMember } from '@/features/member/hooks/useCurrentMember';
import { ThreadComment } from '../model/ThreadCommentModel';
import { updateThreadCommentCountCache } from '../utils/updateThreadCommentCountCache';
import { updateThreadCommentReplyCache } from '../utils/updateThreadCommentReplyCache';

/**
 * ✅ 대댓글 생성 훅 (Optimistic + 캐시 동기화)
 * - 댓글의 대댓글 카운트 +1
 * - childCommentResponseDtos가 3 미만이면 바로 반영
 */
export function useCreateThreadCommentReplyWithOptimistic(
  threadId: string,
  commentListRef?: React.RefObject<ThreadCommentListRef | null>,
) {
  const { member } = useCurrentMember();
  const queryClient = useQueryClient();
  const isSubmittingRef = useRef(false);

  const handleSubmit = async (text: string, parentCommentThreadId: string) => {
    if (isSubmittingRef.current) return;
    isSubmittingRef.current = true;

    let tempId = '';
    const now = new Date().toISOString();

    try {
      if (!member?.id) throw new Error('로그인이 필요합니다.');

      tempId = `temp-${Date.now()}`;

      // ✅ 임시 대댓글 생성
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

      // ✅ 캐시 갱신: 총 댓글 수 +1
      updateThreadCommentCountCache(queryClient, threadId, +1);

      // ✅ 서버 요청
      const real = await createThreadComment({
        threadId,
        description: text,
        parentCommentThreadId,
      });

      const realReply: ThreadComment = {
        commentThreadId: real.commentThreadId,
        threadId: real.threadId,
        description: real.description,
        depth: 1,
        parentCommentThreadId,
        memberId: real.memberId ?? member.id,
        memberNickName: real.memberNickName ?? member.nickname,
        memberProfileImageUrl:
          real.memberProfileImageUrl ?? member.profileImageUrl,
        reactionCount: real.reactionCount ?? 0,
        reactedByCurrentMember: real.reactedByCurrentMember ?? false,
        isPending: false,
        createDatetime: real.createDatetime ?? now,
      } as any;

      // ✅ 캐시 갱신: 부모 댓글 childCount +1 & 3개 이하이면 추가
      updateThreadCommentReplyCache(
        queryClient,
        threadId,
        parentCommentThreadId,
        realReply,
      );

      // ✅ 실제 리스트 반영
      commentListRef?.current?.replaceTempComment(tempId, realReply);
    } catch (err) {
      console.warn(
        '❌ [useCreateThreadCommentReplyWithOptimistic] 대댓글 작성 실패:',
        err,
      );
      commentListRef?.current?.removeTempComment(tempId);
      updateThreadCommentCountCache(queryClient, threadId, -1);
    } finally {
      isSubmittingRef.current = false;
    }
  };

  return { handleSubmit };
}
