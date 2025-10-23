import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchFeedThreads } from '../api/fetchFeedThreads';
import { THREAD_KEYS } from '../keys/threadKeys';
import { Thread } from '../model/ThreadModel';

type FetchFeedThreadsResult = {
  threads: Thread[];
  threadIds: string[];
  nextCursorMark: string | null;
};

/**
 * 🪄 피드 전용 쓰레드 목록 무한스크롤 훅
 */
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

export const useFetchFeedThreads = (
  { memberId, distance, latitude, longitude, searchType }: Params,
  { enabled = true }: Options = {},
) => {
  return useInfiniteQuery<
    FetchFeedThreadsResult,
    Error,
    Thread[],
    ReturnType<typeof THREAD_KEYS.list>,
    string
  >({
    queryKey: THREAD_KEYS.list(searchType, memberId, distance),
    initialPageParam: '',

    // ✅ 페이지 호출 함수
    queryFn: ({ pageParam }) => {
      // ⬇️⬇️⬇️ 여기 추가 ⬇️⬇️⬇️
      if (!memberId) {
        console.warn('⚠️ [useFetchFeedThreads] memberId 없음 → 요청 스킵');
        return Promise.resolve({
          threads: [],
          threadIds: [],
          nextCursorMark: null,
        });
      }

      console.log('📡 [useFetchFeedThreads] 요청 파라미터', {
        memberId,
        distance,
        latitude,
        longitude,
        searchType,
        pageParam,
      });
      // ⬆️⬆️⬆️ 여기 추가 끝 ⬆️⬆️⬆️

      return fetchFeedThreads(
        memberId,
        distance,
        pageParam,
        latitude,
        longitude,
        searchType,
      );
    },

    // ✅ 다음 페이지 커서
    getNextPageParam: lastPage =>
      lastPage.nextCursorMark ? lastPage.nextCursorMark : undefined,

    // ✅ 모든 페이지 평탄화
    select: data => data.pages.flatMap(page => page.threads),

    // ✅ member가 아직 로드 안됐으면 호출 안함
    enabled,
  });
};
