// 📄 src/features/thread/hooks/useFetchFeedThreads.ts
import {
  useInfiniteQuery,
  useQueryClient,
  type UseInfiniteQueryResult,
  type InfiniteData,
} from '@tanstack/react-query';
import { fetchFeedThreads } from '../api/fetchFeedThreads';
import { THREAD_KEYS } from '../keys/threadKeys';
import { Thread } from '../model/ThreadModel';

export type FetchFeedThreadsResult = {
  threads: Thread[];
  threadIds: string[];
  nextCursorMark: string | null;
};

type Params = {
  memberId: string;
  distance: number | '100000000';
  latitude?: number;
  longitude?: number;
  searchType: 'POPULARITY' | 'RECOMMENDED' | 'MOSTRECENT';
};

type Options = {
  enabled?: boolean;
};

export function useFetchFeedThreads(
  { memberId, distance, latitude, longitude, searchType }: Params,
  { enabled = true }: Options = {},
): UseInfiniteQueryResult<InfiniteData<FetchFeedThreadsResult>, Error> {
  const queryClient = useQueryClient();

  return useInfiniteQuery<
    FetchFeedThreadsResult,
    Error,
    InfiniteData<FetchFeedThreadsResult>,
    ReturnType<typeof THREAD_KEYS.list>,
    string
  >({
    queryKey: THREAD_KEYS.list(),
    enabled: Boolean(memberId) && enabled,
    initialPageParam: '',
    queryFn: async ({ pageParam }) => {
      const cursor = typeof pageParam === 'string' ? pageParam : '';

      const data = await fetchFeedThreads(
        memberId,
        distance,
        cursor,
        latitude,
        longitude,
        searchType,
      );

      // ✅ 캐시 주입 시 동일 객체면 갱신 Skip
      data.threads.forEach((thread: Thread) => {
        queryClient.setQueryData(THREAD_KEYS.detail(thread.threadId), old => {
          // 캐시가 비어있으면 새로 저장
          if (!old) return thread;

          // 내용 완전히 같으면 skip
          if (JSON.stringify(old) === JSON.stringify(thread)) return old;

          // 다를 때만 갱신
          return thread;
        });
      });

      return data;
    },
    getNextPageParam: lastPage => lastPage.nextCursorMark ?? undefined,
  });
}
