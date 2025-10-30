// src/features/thread/hooks/useThreadLike.ts
import { useState, useCallback } from 'react';
import { updateThreadReaction } from '../api/updateThreadReaction';
import { useCurrentMember } from '@/features/member/hooks/useCurrentMember';

/**
 * ✅ 좋아요 훅 (쿼리 캐시 제거 버전)
 * - React Query 제거
 * - 로컬 상태(liked, count)와 서버 호출만 관리
 */
type UseThreadLikeParams = {
  threadId: string;
  currentMemberId?: string;
  initialLiked: boolean;
  initialCount: number;
};

export function useThreadLike({
  threadId,
  currentMemberId,
  initialLiked,
  initialCount,
}: UseThreadLikeParams) {
  const [liked, setLiked] = useState(initialLiked);
  const [likeCount, setLikeCount] = useState(initialCount);
  const [inflight, setInflight] = useState(false);
  const { member } = useCurrentMember();
  const resolvedMemberId = currentMemberId || member?.id;

  const toggleLike = useCallback(async () => {
    if (!resolvedMemberId) {
      console.warn('⚠️ [useThreadLike] 로그인 정보 없음 → 좋아요 불가');
      return;
    }
    if (inflight) return;

    const nextLiked = !liked;
    setLiked(nextLiked);
    setLikeCount(prev => Math.max(0, prev + (nextLiked ? 1 : -1)));

    try {
      setInflight(true);
      await updateThreadReaction({
        threadId,
        currentMemberId: resolvedMemberId,
        nextLiked,
      });
    } catch (e) {
      console.warn('❌ [useThreadLike] 좋아요 요청 실패:', e);
      // 실패 시 롤백
      setLiked(liked);
      setLikeCount(initialCount);
    } finally {
      setInflight(false);
    }
  }, [resolvedMemberId, liked, inflight, threadId, initialCount]);

  return { liked, likeCount, toggleLike, inflight };
}
