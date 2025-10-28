import { useRef } from 'react';
import { createThreadComment } from '../api/createThreadComment';
import { updateThreadCommentCountCache } from '../utils/updateThreadCommentCountCache';
import { useCurrentMember } from '@/features/member/hooks/useCurrentMember';
import { ThreadCommentListRef } from '../lists/ThreadCommentList';

export function useCreateThreadCommentWithOptimistic(
  threadId: string,
  commentListRef: React.RefObject<ThreadCommentListRef | null>, // ✅ null 허용
) {
  const { member } = useCurrentMember();
  const isSubmittingRef = useRef(false);

  const handleSubmit = async (text: string) => {
    if (isSubmittingRef.current) return;
    isSubmittingRef.current = true;

    let tempId = ''; // ✅ try 바깥으로 이동

    try {
      if (!member?.id) throw new Error('로그인이 필요합니다.');

      tempId = `temp-${Date.now()}`;
      //   const now = new Date().toISOString();

      const tempComment = {
        commentThreadId: tempId,
        threadId,
        description: text,
        depth: 0,
        likeCount: 0,
        likedByMe: false,
        memberId: member.id,
        memberNickName: member.nickname,
        memberProfileImageUrl: member.profileImageUrl ?? '', // ✅ 기본값 추가
        reactionCount: 0,
        reactedByCurrentMember: false,
        isPending: true,
        createDatetime: '',
      };

      commentListRef.current?.addOptimisticComment(tempComment);
      updateThreadCommentCountCache(threadId);

      const real = await createThreadComment({
        threadId,
        description: text,
      });

      const realComment = {
        commentThreadId: real.commentThreadId,
        threadId: real.threadId,
        description: real.description,
        depth: real.depth ?? 0,
        likeCount: real.likeCount ?? 0,
        likedByMe: real.likedByMe ?? false,
        memberId: real.memberId ?? member.id,
        memberNickName: real.memberNickName ?? member.nickname,
        memberProfileImageUrl:
          real.memberProfileImageUrl ?? member.profileImageUrl,
        reactionCount: real.reactionCount ?? 0,
        reactedByCurrentMember: real.reactedByCurrentMember ?? false,
        isPending: false,
        createDatetime: '',
      };

      commentListRef.current?.replaceTempComment(tempId, realComment);
    } catch (e) {
      console.warn('댓글 작성 실패:', e);
      commentListRef.current?.removeTempComment(tempId);
    } finally {
      isSubmittingRef.current = false;
    }
  };

  return { handleSubmit };
}
