import { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { THREAD_KEYS } from '../keys/threadKeys';
import { updateThreadCache } from '../utils/updateThreadCache';
import { updateThreadReaction } from '../api/updateThreadReaction';
import { useCurrentMember } from '@/features/member/hooks/useCurrentMember';
import { Thread } from '../model/ThreadModel';

type Params = {
  threadId: string;
  initialLiked: boolean | null;
  initialCount: number | null;
  listParams?: Parameters<typeof THREAD_KEYS.list>;
};

/**
 * 🧠 좋아요 토글 훅 (Optimistic + 로컬 반응 + 캐시 동기화 + 서버 통신)
 */
export function useThreadLike({
  threadId,
  initialLiked,
  initialCount,
}: Params) {
  const queryClient = useQueryClient();
  const { member } = useCurrentMember();

  const [liked, setLiked] = useState(initialLiked ?? false);
  const [likeCount, setLikeCount] = useState(initialCount ?? 0);

  /**
   * ✅ ① prop이 변경되면 로컬 상태 동기화
   * - RouteThread_ChildThreadList에서 새 thread 데이터가 들어오면 반영
   */
  useEffect(() => {
    setLiked(initialLiked ?? false);
    setLikeCount(initialCount ?? 0);
  }, [initialLiked, initialCount]);

  /**
   * ✅ ② 캐시 변경 자동 감시
   * - React Query 캐시(detail)가 갱신되면, 내부 상태를 동기화함
   * - 초기 캐시 조회는 하지 않음 (prop 우선)
   */
  useEffect(() => {
    // ✅ 캐시 업데이트 시 자동 반영
    const unsubscribe = queryClient.getQueryCache().subscribe(event => {
      if (
        event?.query?.queryKey &&
        JSON.stringify(event.query.queryKey) ===
          JSON.stringify(THREAD_KEYS.detail(threadId))
      ) {
        const updated = event.query.state.data as Thread | undefined;
        if (updated) {
          setLiked(updated.reactedByCurrentMember ?? false);
          setLikeCount(updated.reactionCount ?? 0);
        }
      }
    });

    return unsubscribe;
  }, [queryClient, threadId]);

  /**
   * ✅ ③ 좋아요 토글 mutation
   */
  const { mutate: toggleLike, isPending: inflight } = useMutation({
    mutationFn: async (nextLiked: boolean) =>
      updateThreadReaction({
        threadId,
        currentMemberId: member?.id ?? '',
        nextLiked,
      }),

    onMutate: async () => {
      const nextLiked = !liked;
      const nextCount = nextLiked ? likeCount + 1 : likeCount - 1;

      // 1️⃣ 로컬 상태 즉시 반영
      setLiked(nextLiked);
      setLikeCount(nextCount);

      // 2️⃣ 캐시 반영
      updateThreadCache(queryClient, threadId, {
        reactedByCurrentMember: nextLiked,
        reactionCount: nextCount,
      });

      return { prevLiked: liked, prevCount: likeCount, nextLiked };
    },

    onSuccess: () => {
      // ✅ 서버 성공 시 캐시 최신화 (서버 데이터가 다를 수 있으므로)
      queryClient.invalidateQueries({
        queryKey: THREAD_KEYS.detail(threadId),
        exact: true,
      });
    },

    onError: (_err, _vars, context) => {
      if (context) {
        console.warn('❌ 서버 요청 실패 → 롤백');
        setLiked(context.prevLiked);
        setLikeCount(context.prevCount);
        updateThreadCache(queryClient, threadId, {
          reactedByCurrentMember: context.prevLiked,
          reactionCount: context.prevCount,
        });
      }
    },
  });

  // ✅ toggleLike 호출 시 nextLiked 넘겨줌
  const handleToggle = () => {
    toggleLike(!liked);
  };

  return { liked, likeCount, toggleLike: handleToggle, inflight };
}
