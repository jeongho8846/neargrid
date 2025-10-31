import { useQuery, useQueryClient } from '@tanstack/react-query';
import { THREAD_KEYS } from '../keys/threadKeys';
import { Thread, createEmptyThread } from '../model/ThreadModel';

/**
 * 🧩 단일 Thread 조회 훅 (서버 요청 없이 캐시 기반)
 * - 캐시에 존재하면 즉시 반환
 * - 없을 경우 빈 placeholder(Thread) 반환
 * - 피드 리스트에서 캐싱된 Thread를 공유하는 목적
 */
export function useThreadQuery(threadId: string) {
  const queryClient = useQueryClient();

  return useQuery<Thread>({
    queryKey: THREAD_KEYS.detail(threadId),
    enabled: Boolean(threadId),
    queryFn: async () => {
      const cached = queryClient.getQueryData<Thread>(
        THREAD_KEYS.detail(threadId),
      );

      if (cached) {
        console.log('📦 [CacheRead] 캐시에서 읽은 Thread:', threadId, cached);
        return cached;
      }

      console.warn(
        `[useThreadQuery] 캐시에 ${threadId} 없음 → placeholder 반환`,
      );
      return createEmptyThread(threadId);
    },
    staleTime: Infinity,
    gcTime: 1000 * 60 * 30,
  });
}
