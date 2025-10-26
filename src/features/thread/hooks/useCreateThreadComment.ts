// src/features/thread/hooks/useCreateThreadComment.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createThreadComment } from '../api/createThreadComment';

export const useCreateThreadComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createThreadComment,
    onSuccess: (_, variables) => {
      const { threadId } = variables;

      // 단일 thread 캐시 업데이트
      queryClient.setQueryData(['thread', threadId], (prev: any) =>
        prev
          ? {
              ...prev,
              commentThreadCount: (prev.commentThreadCount ?? 0) + 1,
            }
          : prev,
      );

      // 목록 캐시 업데이트 (예: 피드, 지도 등)
      queryClient.setQueriesData({ queryKey: ['threads'] }, (old: any) => {
        if (!old) return old;
        return {
          ...old,
          pages: old.pages.map((page: any) => ({
            ...page,
            threads: page.threads.map((t: any) =>
              t.threadId === threadId
                ? {
                    ...t,
                    commentThreadCount: (t.commentThreadCount ?? 0) + 1,
                  }
                : t,
            ),
          })),
        };
      });
    },
  });
};
