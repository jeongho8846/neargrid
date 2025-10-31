import { useQuery } from '@tanstack/react-query';
import { fetchChildCommentThreads } from '../api/fetchChildCommentThreads';

export const COMMENT_THREAD_KEYS = {
  children: (threadId: string, parentCommentId: string) =>
    ['commentThreads', threadId, parentCommentId] as const,
};

/**
 * ✅ 자식 댓글(대댓글) 조회 훅
 * - React Query 캐싱 기반
 * - 캐시 키: ['commentThreads', threadId, parentCommentId]
 */
export function useFetchChildCommentThreads(
  threadId: string,
  parentCommentId: string,
  memberId?: string,
) {
  return useQuery({
    queryKey: COMMENT_THREAD_KEYS.children(threadId, parentCommentId),
    queryFn: () =>
      fetchChildCommentThreads({
        threadId,
        commentThreadId: parentCommentId,
        currentMemberId: memberId ?? '',
      }),
    enabled: !!threadId && !!parentCommentId && !!memberId,
  });
}
