import { apiContents } from '@/services/apiService';
import { FetchThreadsResponse, Thread } from '../model/ThreadModel';
import { mapThreadResponse } from '../mappers/threadMapper';

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
  let params: any = {};

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
      latitude: latitude || 0,
      longitude: longitude || 0,
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

    const threads = data.threadResponseSingleDtos.map(mapThreadResponse);
    const threadIds = threads.map(t => t.threadId);

    console.log('✅ [fetchFeedThreads] Response:', {
      status: response.status,
      count: threads.length,
      nextCursorMark: data.nextCursorMark,
      sample: threads[0],
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
    return {
      threads: [],
      threadIds: [],
      nextCursorMark: null,
    };
  }
};
