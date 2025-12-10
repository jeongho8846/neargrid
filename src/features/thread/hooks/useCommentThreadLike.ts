import { useEffect, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useCurrentMember } from '@/features/member/hooks/useCurrentMember';
import { updateCommentThreadReaction } from '../api/updateCommentThreadReaction';
import { updateCommentThreadCache } from '../utils/updateCommentThreadCache';
import { ThreadComment } from '../model/ThreadCommentModel';

type Params = {
  threadId?: string;
  commentThreadId: string;
  initialLiked: boolean | null | undefined;
  initialCount: number | null | undefined;
};

const COMMENT_KEY_PREFIX = 'commentThreads';
const COMMENT_DETAIL_PREFIX = 'commentThread';

function findCommentInData(
  data: any,
  commentThreadId: string,
): ThreadComment | undefined {
  if (!data || !commentThreadId) return undefined;

  if (Array.isArray(data)) {
    for (const item of data) {
      if (item?.commentThreadId === commentThreadId) return item;
      const found = findCommentInData(
        item?.initialChildCommentThreadResponseDtos,
        commentThreadId,
      );
      if (found) return found;
    }
    return undefined;
  }

  if (data.pages) {
    for (const page of data.pages) {
      const found = findCommentInData(page?.data, commentThreadId);
      if (found) return found;
    }
  }

  if (data.commentThreadResponseDtos) {
    return findCommentInData(
      data.commentThreadResponseDtos,
      commentThreadId,
    );
  }

  if (data.childCommentThreadResponseDtos) {
    return findCommentInData(
      data.childCommentThreadResponseDtos,
      commentThreadId,
    );
  }

  if (data.commentThreadId === commentThreadId) {
    return data as ThreadComment;
  }

  return undefined;
}

export function useCommentThreadLike({
  threadId,
  commentThreadId,
  initialLiked,
  initialCount,
}: Params) {
  const queryClient = useQueryClient();
  const { member } = useCurrentMember();

  const [liked, setLiked] = useState(initialLiked ?? false);
  const [likeCount, setLikeCount] = useState(initialCount ?? 0);

  // prop 변경 시 동기화
  useEffect(() => {
    setLiked(initialLiked ?? false);
    setLikeCount(initialCount ?? 0);
  }, [initialLiked, initialCount]);

  // 캐시 업데이트 감시
  useEffect(() => {
    const unsubscribe = queryClient.getQueryCache().subscribe(event => {
      if (!event?.query?.queryKey) return;
      const key = event.query.queryKey as any[];
      const prefix = key[0];
      if (
        prefix !== COMMENT_KEY_PREFIX &&
        prefix !== COMMENT_DETAIL_PREFIX
      ) {
        return;
      }
      const data = event.query.state.data;
      const found = findCommentInData(data, commentThreadId);
      if (found) {
        setLiked(found.reactedByCurrentMember ?? false);
        setLikeCount(found.reactionCount ?? 0);
      }
    });

    return unsubscribe;
  }, [queryClient, commentThreadId]);

  const { mutate: toggleLike, isPending: inflight } = useMutation({
    mutationFn: async (nextLiked: boolean) =>
      updateCommentThreadReaction({
        threadId: threadId ?? '',
        commentThreadId,
        currentMemberId: member?.id ?? '',
        nextLiked,
      }),

    onMutate: async nextLiked => {
      const delta = nextLiked ? 1 : -1;
      const nextCount = Math.max(0, likeCount + delta);

      setLiked(nextLiked);
      setLikeCount(nextCount);

      updateCommentThreadCache(queryClient, threadId, commentThreadId, {
        reactedByCurrentMember: nextLiked,
        reactionCount: nextCount,
      });

      return { prevLiked: liked, prevCount: likeCount };
    },

    onSuccess: () => {
      // 서버 기준 동기화를 위해 관련 캐시 무효화
      queryClient.invalidateQueries({
        predicate: query => {
          const key = query.queryKey as any[];
          if (!Array.isArray(key)) return false;
          const prefix = key[0];
          if (prefix === COMMENT_KEY_PREFIX) {
            return !threadId || key[1] === threadId;
          }
          if (prefix === COMMENT_DETAIL_PREFIX) {
            return key[1] === commentThreadId;
          }
          return false;
        },
      });
    },

    onError: (_err, _vars, context) => {
      if (!context) return;
      setLiked(context.prevLiked);
      setLikeCount(context.prevCount);
      updateCommentThreadCache(queryClient, threadId, commentThreadId, {
        reactedByCurrentMember: context.prevLiked,
        reactionCount: context.prevCount,
      });
    },
  });

  const handleToggle = () => {
    if (!commentThreadId || !threadId || inflight) return;
    toggleLike(!liked);
  };

  return { liked, likeCount, toggleLike: handleToggle, inflight };
}
