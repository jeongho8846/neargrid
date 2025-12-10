import { QueryClient } from '@tanstack/react-query';
import { ThreadComment } from '../model/ThreadCommentModel';

/**
 * 🧠 댓글/대댓글 캐시 갱신 유틸
 * - commentThreadId가 일치하는 항목을 찾아 부분 업데이트
 * - 'commentThreads' (리스트/자식 리스트)와 'commentThread' (단건) 캐시 모두 처리
 */
export function updateCommentThreadCache(
  queryClient: QueryClient,
  threadId: string | undefined,
  commentThreadId: string,
  partial: Partial<ThreadComment>,
) {
  if (!commentThreadId) return;

  // 내부 배열 업데이트 헬퍼 (자식 포함)
  const updateArray = (arr: ThreadComment[] | undefined) => {
    if (!Array.isArray(arr)) return arr;

    let touched = false;
    const next = arr.map(item => {
      let updated: ThreadComment = item;

      if (item.commentThreadId === commentThreadId) {
        touched = true;
        updated = { ...item, ...partial };
      }

      if (item.initialChildCommentThreadResponseDtos?.length) {
        const nextChildren = updateArray(
          item.initialChildCommentThreadResponseDtos,
        );
        if (
          nextChildren &&
          nextChildren !== item.initialChildCommentThreadResponseDtos
        ) {
          touched = true;
          updated = {
            ...updated,
            initialChildCommentThreadResponseDtos: nextChildren,
          };
        }
      }

      return updated;
    });

    return touched ? next : arr;
  };

  // 데이터 구조별 업데이트
  const applyUpdate = (data: any) => {
    if (!data) return data;

    // 1) 배열 형태
    if (Array.isArray(data)) {
      return updateArray(data);
    }

    // 2) infiniteQuery 형태
    if (data.pages) {
      let touched = false;
      const nextPages = data.pages.map((page: any) => {
        if (!page?.data) return page;
        const updated = applyUpdate(page.data);
        if (updated !== page.data) touched = true;
        return { ...page, data: updated };
      });
      return touched ? { ...data, pages: nextPages } : data;
    }

    // 3) 객체 형태 (리스트 응답)
    if (data.commentThreadResponseDtos) {
      const updated = updateArray(data.commentThreadResponseDtos);
      return updated !== data.commentThreadResponseDtos
        ? { ...data, commentThreadResponseDtos: updated }
        : data;
    }
    if (data.childCommentThreadResponseDtos) {
      const updated = updateArray(data.childCommentThreadResponseDtos);
      return updated !== data.childCommentThreadResponseDtos
        ? { ...data, childCommentThreadResponseDtos: updated }
        : data;
    }

    // 4) 단건
    if (data.commentThreadId === commentThreadId) {
      return { ...data, ...partial };
    }

    return data;
  };

  // commentThreads prefix (리스트/자식 리스트)
  queryClient
    .getQueryCache()
    .findAll({ queryKey: ['commentThreads'] })
    .forEach(q => {
      const key = q.queryKey;
      // threadId 스코프가 있는 경우만 업데이트 (있다면)
      if (threadId && key[1] && key[1] !== threadId) return;
      const data = queryClient.getQueryData<any>(key);
      const next = applyUpdate(data);
      if (next !== data) {
        queryClient.setQueryData(key, next);
      }
    });

  // 단건 commentThread 캐시
  queryClient
    .getQueryCache()
    .findAll({ queryKey: ['commentThread'] })
    .forEach(q => {
      const key = q.queryKey;
      if (key[1] !== commentThreadId) return;
      const data = queryClient.getQueryData<any>(key);
      const next = applyUpdate(data);
      if (next !== data) {
        queryClient.setQueryData(key, next);
      }
    });
}
