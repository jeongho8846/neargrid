// src/features/thread/hooks/useFetchFeedThreads.ts
import { fetchFeedThreads } from '../api/fetchFeedThreads';
import { Thread } from '../model/ThreadModel';

type FetchFeedThreadsResult = {
  threads: Thread[];
  threadIds: string[];
  nextCursorMark: string | null;
};

/**
 * 🪄 피드 전용 쓰레드 목록 불러오기 (쿼리 구조 제거 버전)
 * - React Query 제거
 * - 단순 서버 데이터 요청 함수로 변경
 */
type Params = {
  memberId: string;
  distance: number | '100000000';
  latitude?: number;
  longitude?: number;
  searchType: 'POPULARITY' | 'RECOMMENDED' | 'MOSTRECENT';
  cursorMark?: string; // 무한스크롤용 커서
};

/**
 * 서버에서 피드 쓰레드 목록을 직접 fetch하는 함수
 * (React Query 훅 제거 버전)
 */
export const fetchFeedThreadsDirect = async ({
  memberId,
  distance,
  latitude,
  longitude,
  searchType,
  cursorMark = '',
}: Params): Promise<FetchFeedThreadsResult> => {
  if (!memberId) {
    console.warn('⚠️ [fetchFeedThreadsDirect] memberId 없음 → 요청 스킵');
    return { threads: [], threadIds: [], nextCursorMark: null };
  }

  console.log('📡 [fetchFeedThreadsDirect] 요청 파라미터', {
    memberId,
    distance,
    latitude,
    longitude,
    searchType,
    cursorMark,
  });

  const result = await fetchFeedThreads(
    memberId,
    distance,
    cursorMark,
    latitude,
    longitude,
    searchType,
  );

  return result;
};
