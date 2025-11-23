// 📄 src/features/thread/hooks/useReadRouteThreadChildThreads.ts
import { useQuery } from '@tanstack/react-query';
import { readThreadDetail } from '../api/readThreadDetail';
import { Thread } from '../model/ThreadModel';

/**
 * ✅ ROUTE_THREAD의 자식 스레드 목록 조회 훅 (React Query 기반)
 * - key: ['routeThreadChildThreads', threadId]
 * - 반환 데이터: Thread[]
 * - ROUTE_THREAD의 자식 GENERAL_THREAD 리스트
 */
export function useReadRouteThreadChildThreads(
  threadId: string,
  memberId?: string,
) {
  return useQuery<Thread[]>({
    queryKey: ['routeThreadChildThreads', threadId],
    enabled: Boolean(threadId && memberId),
    queryFn: async () => {
      if (!threadId || !memberId) return [];
      const threads = await readThreadDetail({
        threadId,
        readThreadType: 'CHILD_THREAD',
        currentMemberId: memberId,
      });
      return threads ?? [];
    },
    staleTime: 10_000, // 10초간 캐시 유지
  });
}
