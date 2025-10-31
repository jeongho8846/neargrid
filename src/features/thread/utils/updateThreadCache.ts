import { QueryClient } from '@tanstack/react-query';
import { Thread } from '../model/ThreadModel';

/**
 * 🧩 모든 thread 관련 캐시를 순회하며 threadId 일치 항목 업데이트
 */
export function updateThreadCache(
  queryClient: QueryClient,
  threadId: string,
  partial: Partial<Thread>,
) {
  // ✅ 1. 'threads' prefix로 시작하는 모든 캐시 가져오기
  const queries = queryClient
    .getQueryCache()
    .findAll({ queryKey: ['threads'] });

  queries.forEach(q => {
    const key = q.queryKey;
    const data = queryClient.getQueryData<any>(key);
    if (!data) return;

    // ✅ 2. 구조별로 처리
    if (data.pages) {
      // infiniteQuery 구조
      const newData = {
        ...data,
        pages: data.pages.map((page: any) => ({
          ...page,
          threads: page.threads
            ? page.threads.map((t: Thread) =>
                t.threadId === threadId ? { ...t, ...partial } : t,
              )
            : page.threads,
        })),
      };
      queryClient.setQueryData(key, newData);
    } else if (data.threadId === threadId) {
      // detail 구조
      queryClient.setQueryData(key, { ...data, ...partial });
    }
  });
}
