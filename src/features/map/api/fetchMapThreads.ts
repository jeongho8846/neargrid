import { apiContents } from '@/services/apiService';

/**
 * ✅ 지도 중심 좌표 기준 Thread 목록 조회
 * - 서버 DTO를 그대로 돌려보낸다 (좌표 보존용)
 * - 여기서는 mapServerThread() 하지 않는다 ❗
 */
type FetchMapThreadsParams = {
  latitude: number;
  longitude: number;
  distance?: number;
  memberId: string;
  timeFilter?: number;
  remainTime?: number;
  threadTypes?: string[];
  isIncludeHubThread?: boolean;
  isIncludePastRemainDateTime?: boolean;
};

export const fetchMapThreads = async ({
  latitude,
  longitude,
  distance = 3000,
  memberId,
  timeFilter = 0,
  remainTime = '',
  threadTypes = [],
  isIncludeHubThread = '',
  isIncludePastRemainDateTime = '',
}: FetchMapThreadsParams): Promise<{
  threadResponseSingleDtos: any[];
  nextCursorMark: string | null;
}> => {
  const params = {
    latitude,
    longitude,
    keyword: '',
    cursor_mark: '',
    distance_m: distance,
    current_member_id: memberId,
    sort_type: 'RECENT',
    Nullable_recent_time_minute: timeFilter || '',
    Nullable_remain_time_minute: remainTime || '',
    Nullable_thread_types: threadTypes.length ? threadTypes.join(',') : '',
    Nullable_is_include_hub_thread:
      isIncludeHubThread !== '' ? String(isIncludeHubThread) : '',
    Nullable_is_include_past_remain_date_time:
      isIncludePastRemainDateTime !== ''
        ? String(isIncludePastRemainDateTime)
        : '',
  };

  console.log('📡 [fetchMapThreads] 요청 params:', params);

  const res = await apiContents.get(
    '/search/getThreadByDescriptionAndDistance',
    { params },
  );

  console.log('📥 [fetchMapThreads] raw response:', res.data);

  return {
    threadResponseSingleDtos: res.data.threadResponseSingleDtos ?? [],
    nextCursorMark: res.data.nextCursorMark ?? null,
  };
};
