// src/features/thread/utils/updateThreadCommentCountCache.ts
import { queryClient } from '@/services/reactQuery/reactQueryClient'; // ✅ 인스턴스 import

export const updateThreadCommentCountCache = (threadId: string) => {
  try {
    queryClient.setQueryData(['thread', threadId], (prev: any) =>
      prev
        ? { ...prev, commentThreadCount: (prev.commentThreadCount ?? 0) + 1 }
        : prev,
    );

    queryClient.setQueriesData({ queryKey: ['threads'] }, (old: any) => {
      if (!old) return old;
      return {
        ...old,
        pages: old.pages.map((page: any) => ({
          ...page,
          threads: page.threads.map((t: any) =>
            t.threadId === threadId
              ? { ...t, commentThreadCount: (t.commentThreadCount ?? 0) + 1 }
              : t,
          ),
        })),
      };
    });
  } catch (err) {
    console.warn('⚠️ 캐시 업데이트 실패:', err);
  }
};
