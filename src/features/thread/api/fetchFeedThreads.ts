import { apiContents } from '@/services/apiService';
import { FetchThreadsResponse, Thread } from '../model/ThreadModel';
import { mapServerThread } from '../mappers/threadMapper';

/**
 * ✅ 피드 쓰레드 목록 조회 API
 * - searchType에 따라 다른 엔드포인트 호출
 * - Thread 단위 캐싱 구조와 호환되도록 반환
 */
export const fetchFeedThreads = async (
  member_id: string,
  adjustedDistance: number | '100000000',
  feedpagingState: string | '',
  latitude: number | undefined,
  longitude: number | undefined,
  searchType: 'POPULARITY' | 'RECOMMENDED' | 'MOSTRECENT',
): Promise<{
  threads: Thread[];
  threadIds: string[];
  nextCursorMark: string | null;
}> => {
  let apiEndpoint = '';
  let params: Record<string, any> = {};

  if (searchType === 'RECOMMENDED') {
    apiEndpoint = '/thread/readFeedIdList';
    params = {
      member_id,
      Blankable_distance_m: adjustedDistance,
      paging_offset: feedpagingState || '',
    };
  } else {
    apiEndpoint = '/search/getThreadForFeed';
    params = {
      keyword: '',
      current_member_id: member_id,
      latitude: latitude ?? 0,
      longitude: longitude ?? 0,
      distance_m: adjustedDistance.toString(),
      cursor_mark: feedpagingState || '',
      sort_type: searchType === 'POPULARITY' ? 'POPULARITY' : '',
    };
  }

  console.log('📡 [fetchFeedThreads] Request:', {
    endpoint: apiEndpoint,
    params,
  });

  try {
    const response = await apiContents.get(apiEndpoint, { params });
    const data = response.data as FetchThreadsResponse;

    // ✅ 서버 응답 매핑
    const threads = data.threadResponseSingleDtos.map(mapServerThread);
    const threadIds = threads.map(t => t.threadId);

    console.log('✅ [fetchFeedThreads] Response:', {
      status: response.status,
      count: threads.length,
      nextCursorMark: data.nextCursorMark,
    });

    return {
      threads,
      threadIds,
      nextCursorMark: data.nextCursorMark,
    };
  } catch (error: any) {
    console.error('❌ [fetchFeedThreads] Error:', {
      message: error?.message,
      response: error?.response?.data,
      status: error?.response?.status,
    });

    // 실패 시에도 구조는 동일하게 유지
    return {
      threads: [],
      threadIds: [],
      nextCursorMark: null,
    };
  }
};
