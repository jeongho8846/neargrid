import { QueryClient } from '@tanstack/react-query';
import { Thread } from '../model/ThreadModel';

/**
 * 🧩 모든 thread 관련 캐시를 순회하며 threadId 일치 항목 업데이트
 */
export function updateThreadCache(
  queryClient: QueryClient,
  threadId: string,
  partial:
    | Partial<Thread>
    | ((prev: Thread) => Thread)
    | {
        editMemberResponseSimpleDtos?: Thread['editMemberResponseSimpleDtos'] | ((prev: Thread['editMemberResponseSimpleDtos']) => Thread['editMemberResponseSimpleDtos']);
      },
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
    const applyPartial = (thread: Thread) => {
      if (typeof partial === 'function') {
        return (partial as (prev: Thread) => Thread)(thread);
      }
      const next: any = { ...thread, ...partial };
      if (partial && typeof partial === 'object' && 'editMemberResponseSimpleDtos' in partial) {
        const v = (partial as any).editMemberResponseSimpleDtos;
        next.editMemberResponseSimpleDtos =
          typeof v === 'function' ? v(thread.editMemberResponseSimpleDtos) : v;
      }
      return next;
    };

    if (data.pages) {
      const newData = {
        ...data,
        pages: data.pages.map((page: any) => ({
          ...page,
          threads: page.threads
            ? page.threads.map((t: Thread) =>
                t.threadId === threadId ? applyPartial(t) : t,
              )
            : page.threads,
        })),
      };
      queryClient.setQueryData(key, newData);
    } else if (data.threadId === threadId) {
      queryClient.setQueryData(key, applyPartial(data));
    }
  });
}
