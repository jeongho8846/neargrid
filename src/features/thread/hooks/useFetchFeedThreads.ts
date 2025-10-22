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

export const useFetchFeedThreads = ({
  memberId,
  distance,
  latitude,
  longitude,
  searchType,
}: Params) => {
  return useInfiniteQuery<
    FetchFeedThreadsResult, // API 결과 타입
    Error, // 에러 타입
    Thread[], // select 결과 타입
    ReturnType<typeof THREAD_KEYS.list>, // queryKey 타입
    string // pageParam 타입
  >({
    queryKey: THREAD_KEYS.list(searchType, memberId, distance),

    // ✅ 필수! 초기 커서값 지정 (React Query v5부터 필수)
    initialPageParam: '',

    // ✅ 페이지 호출 함수
    queryFn: ({ pageParam }) =>
      fetchFeedThreads(
        memberId,
        distance,
        pageParam,
        latitude,
        longitude,
        searchType,
      ),

    // ✅ 다음 페이지 커서
    getNextPageParam: lastPage =>
      lastPage.nextCursorMark ? lastPage.nextCursorMark : undefined,

    // ✅ 모든 페이지 평탄화 (배열 합치기)
    select: data => data.pages.flatMap(page => page.threads),
  });
};
