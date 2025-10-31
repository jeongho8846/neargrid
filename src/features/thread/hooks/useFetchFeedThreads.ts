import {
  useInfiniteQuery,
  useQueryClient,
  type UseInfiniteQueryResult,
  type InfiniteData, // ✅ 추가
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
    FetchFeedThreadsResult, // 각 페이지의 데이터 구조
    Error,
    InfiniteData<FetchFeedThreadsResult>, // ✅ select 이후 data 타입
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

      // ✅ Thread 단위 캐시 주입
      data.threads.forEach((thread: Thread) => {
        queryClient.setQueryData(THREAD_KEYS.detail(thread.threadId), thread);
      });

      return data;
    },
    getNextPageParam: lastPage => lastPage.nextCursorMark ?? undefined,
  });
}
