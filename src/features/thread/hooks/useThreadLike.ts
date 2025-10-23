import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { THREAD_KEYS } from '../keys/threadKeys';
import { Thread } from '../model/ThreadModel';
import { updateThreadReaction } from '../api/updateThreadReaction';
import { useCurrentMember } from '@/features/member/hooks/useCurrentMember'; // ✅ 추가

type ListParams = Parameters<typeof THREAD_KEYS.list>;

type UseThreadLikeParams = {
  threadId: string;
  currentMemberId?: string; // 이제 선택적으로 유지 (직접 전달할 수도 있게)
  initialLiked: boolean;
  initialCount: number;
  listParams?: ListParams;
};

export function useThreadLike({
  threadId,
  currentMemberId, // ✅ 기본값 제거
  initialLiked,
  initialCount,
  listParams = [],
}: UseThreadLikeParams) {
  const qc = useQueryClient();
  const [liked, setLiked] = useState<boolean>(initialLiked);
  const [likeCount, setLikeCount] = useState<number>(initialCount);

  // ✅ AsyncStorage에서 로그인 유저 정보 가져오기
  const { member } = useCurrentMember();
  const resolvedMemberId = currentMemberId || member?.id;

  const targets = useMemo(
    () => ({
      listKey: THREAD_KEYS.list(...(listParams as any[])),
      detailKey: THREAD_KEYS.detail(threadId),
    }),
    [listParams, threadId],
  );

  const { mutate, isPending } = useMutation({
    mutationFn: async (nextLiked: boolean) => {
      if (!resolvedMemberId) {
        console.warn('⚠️ [useThreadLike] memberId 없음 → 요청 스킵');
        return;
      }
      await updateThreadReaction({
        threadId,
        currentMemberId: resolvedMemberId,
        nextLiked,
      });
    },
    onMutate: async nextLiked => {
      await Promise.all([
        qc.cancelQueries({ queryKey: targets.listKey }),
        qc.cancelQueries({ queryKey: targets.detailKey }),
      ]);

      const prevList = qc.getQueryData<any>(targets.listKey);
      const prevDetail = qc.getQueryData<Thread>(targets.detailKey);

      // ✅ Detail 캐시 즉시 반영
      if (prevDetail) {
        qc.setQueryData<Thread>(targets.detailKey, {
          ...prevDetail,
          reactedByCurrentMember: nextLiked,
          reactionCount: Math.max(
            0,
            (prevDetail.reactionCount ?? 0) + (nextLiked ? 1 : -1),
          ),
        });
      }

      // ✅ List 캐시 즉시 반영 (무한스크롤 / 일반 리스트 모두 지원)
      if (prevList?.pages) {
        const newPages = prevList.pages.map((page: any) => {
          const items: Thread[] = page?.items ?? page ?? [];
          const mapped = items.map((it: Thread) =>
            it.threadId === threadId
              ? {
                  ...it,
                  reactedByCurrentMember: nextLiked,
                  reactionCount: Math.max(
                    0,
                    (it.reactionCount ?? 0) + (nextLiked ? 1 : -1),
                  ),
                }
              : it,
          );
          return { ...page, items: mapped };
        });
        qc.setQueryData(targets.listKey, { ...prevList, pages: newPages });
      } else if (Array.isArray(prevList)) {
        const mapped = (prevList as Thread[]).map(it =>
          it.threadId === threadId
            ? {
                ...it,
                reactedByCurrentMember: nextLiked,
                reactionCount: Math.max(
                  0,
                  (it.reactionCount ?? 0) + (nextLiked ? 1 : -1),
                ),
              }
            : it,
        );
        qc.setQueryData(targets.listKey, mapped);
      }

      // ✅ 로컬 상태 즉시 반영
      setLiked(nextLiked);
      setLikeCount(c => Math.max(0, c + (nextLiked ? 1 : -1)));

      return { prevList, prevDetail };
    },
    onError: (_e, _next, ctx) => {
      if (ctx?.prevDetail) qc.setQueryData(targets.detailKey, ctx.prevDetail);
      if (ctx?.prevList) qc.setQueryData(targets.listKey, ctx.prevList);
      setLiked(initialLiked);
      setLikeCount(initialCount);
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: targets.detailKey });
      qc.invalidateQueries({ queryKey: targets.listKey });
    },
  });

  const toggleLike = () => {
    if (!resolvedMemberId) {
      console.warn('⚠️ [useThreadLike] 로그인 정보 없음 → 좋아요 불가');
      return;
    }
    mutate(!liked);
  };

  return { liked, likeCount, toggleLike, inflight: isPending };
}
