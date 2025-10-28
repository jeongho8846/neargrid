// src/common/utils/optimisticList.ts
import { queryClient } from '@/services/reactQuery/reactQueryClient';

type InfiniteData<TPage> = { pages: TPage[]; pageParams: any[] };

/**
 * 리스트의 첫 페이지 맨 앞에 tempItem을 추가
 */
export function optimisticAddItem<TPage extends Record<string, any[]>>(
  queryKey: any[],
  listKey: keyof TPage & string,
  tempItem: any,
) {
  queryClient.setQueriesData(
    { queryKey },
    (old: InfiniteData<TPage> | undefined) => {
      if (!old || !old.pages?.length) return old;
      const first = old.pages[0];
      const arr = (first[listKey] ?? []) as any[];
      return {
        ...old,
        pages: [
          { ...first, [listKey]: [tempItem, ...arr] } as TPage,
          ...old.pages.slice(1),
        ],
      };
    },
  );
}

/**
 * tempId에 해당하는 아이템을 real로 교체
 */
export function optimisticReplaceItem<TPage extends Record<string, any[]>>(
  queryKey: any[],
  listKey: keyof TPage & string,
  tempId: string,
  real: any,
  idField: string = 'id',
) {
  queryClient.setQueriesData(
    { queryKey },
    (old: InfiniteData<TPage> | undefined) => {
      if (!old) return old;
      return {
        ...old,
        pages: old.pages.map(p => {
          const list = (p[listKey] ?? []) as any[];
          return {
            ...p,
            [listKey]: list.map(it => (it[idField] === tempId ? real : it)),
          } as TPage;
        }),
      };
    },
  );
}

/**
 * tempId에 해당하는 아이템을 제거
 */
export function optimisticRemoveItem<TPage extends Record<string, any[]>>(
  queryKey: any[],
  listKey: keyof TPage & string,
  tempId: string,
  idField: string = 'id',
) {
  queryClient.setQueriesData(
    { queryKey },
    (old: InfiniteData<TPage> | undefined) => {
      if (!old) return old;
      return {
        ...old,
        pages: old.pages.map(p => {
          const list = (p[listKey] ?? []) as any[];
          return {
            ...p,
            [listKey]: list.filter(it => it[idField] !== tempId),
          } as TPage;
        }),
      };
    },
  );
}
