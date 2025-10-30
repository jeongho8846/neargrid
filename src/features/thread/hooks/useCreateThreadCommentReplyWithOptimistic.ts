// src/features/thread/hooks/useCreateThreadCommentReplyWithOptimistic.ts
import { useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { createThreadComment } from '../api/createThreadComment';
import { ThreadCommentListRef } from '../lists/ThreadCommentList';
import { useCurrentMember } from '@/features/member/hooks/useCurrentMember';
import { updateThreadCommentCountCache } from '../utils/updateThreadCommentCountCache';
import { ThreadComment } from '../model/ThreadCommentModel';

/**
 * ✅ 대댓글 Optimistic 생성 훅
 * - 임시 UI → 서버 요청 → 캐시 업데이트
 */
export function useCreateThreadCommentReplyWithOptimistic(
  threadId: string,
  commentListRef?: React.RefObject<ThreadCommentListRef | null>,
) {
  const { member } = useCurrentMember();
  const isSubmittingRef = useRef(false);
  const queryClient = useQueryClient();

  const handleSubmit = async (text: string, parentCommentThreadId: string) => {
    if (isSubmittingRef.current) return;
    isSubmittingRef.current = true;

    let tempId = '';
    const now = new Date().toISOString();

    try {
      if (!member?.id) throw new Error('로그인이 필요합니다.');

      tempId = `temp-${Date.now()}`;

      // ✅ 1️⃣ Optimistic 임시 대댓글
      const tempReply: ThreadComment = {
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
      } as any;

      commentListRef?.current?.addOptimisticComment(tempReply);

      // ✅ 2️⃣ 부모 댓글 캐시 수정 (child count +1, preview 배열 추가)
      queryClient.setQueryData(
        ['threadComments', threadId],
        (prev: ThreadComment[] | undefined) => {
          if (!prev) return prev;
          return prev.map(comment =>
            comment.commentThreadId === parentCommentThreadId
              ? {
                  ...comment,
                  childCommentThreadCount:
                    (comment.childCommentThreadCount ?? 0) + 1,
                  initialChildCommentThreadResponseDtos:
                    (comment.initialChildCommentThreadResponseDtos?.length ??
                      0) < 3
                      ? [
                          ...(comment.initialChildCommentThreadResponseDtos ??
                            []),
                          tempReply,
                        ]
                      : comment.initialChildCommentThreadResponseDtos,
                }
              : comment,
          );
        },
      );

      // ✅ 3️⃣ thread 전체 댓글 수량 캐시 업데이트
      updateThreadCommentCountCache(threadId);

      // ✅ 4️⃣ 서버 요청
      const real = await createThreadComment({
        threadId,
        description: text,
        parentCommentThreadId,
      });

      // ✅ 5️⃣ 실제 응답 구조 통일
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

      // ✅ 6️⃣ 리스트 내 임시 → 실제 교체
      commentListRef?.current?.replaceTempComment(tempId, realReply);

      // ✅ 7️⃣ 부모 댓글 캐시에도 반영 (임시 → 실제 교체)
      queryClient.setQueryData(
        ['threadComments', threadId],
        (prev: ThreadComment[] | undefined) => {
          if (!prev) return prev;
          return prev.map(comment =>
            comment.commentThreadId === parentCommentThreadId
              ? {
                  ...comment,
                  initialChildCommentThreadResponseDtos:
                    comment.initialChildCommentThreadResponseDtos?.map(r =>
                      r.commentThreadId === tempId ? realReply : r,
                    ),
                }
              : comment,
          );
        },
      );
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
