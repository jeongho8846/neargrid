import { useQuery } from '@tanstack/react-query';
import { fetchThreadComments } from '../api/fetchThreadComments';
import { ThreadComment } from '../model/ThreadCommentModel';

/**
 * ✅ 댓글 목록 조회 훅 (React Query 기반)
 * - key: ['commentThreads', threadId]
 * - 반환 데이터: ThreadComment[]
 * - 캐시에 저장되어 reply cache 업데이트와 자동 연동됨
 */
export function useFetchThreadComments(threadId: string, memberId?: string) {
  return useQuery<ThreadComment[]>({
    queryKey: ['commentThreads', threadId],
    enabled: Boolean(threadId && memberId),
    queryFn: async () => {
      if (!threadId || !memberId) return [];
      const res = await fetchThreadComments({
        threadId,
        currentMemberId: memberId,
      });
      return res.commentThreadResponseDtos ?? [];
    },
    staleTime: 10_000,
  });
}
