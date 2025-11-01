import { apiContents } from '@/services/apiService';
import {
  Thread,
  ServerThreadDto,
  mapServerThread,
} from '@/features/thread/model/ThreadModel';

/**
 * ✅ 지도 중심 좌표 기준 Thread 목록 조회
 * - 모든 Nullable_* 파라미터는 반드시 포함 (빈 문자열로 처리)
 * - ThreadModel.ts 의 mapServerThread()로 통일된 변환 적용
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
  threads: Thread[];
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

    // ✅ 서버 명세에 맞춰 모든 Nullable_* 필드는 항상 포함 (빈 문자열 허용)
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

  try {
    const res = await apiContents.get(
      '/search/getThreadByDescriptionAndDistance',
      { params },
    );

    console.log('📥 [fetchMapThreads] raw response:', res.data);

    // ✅ 서버 DTO → Thread 변환 (공통 mapServerThread 사용)
    const threads = (
      res.data.threadResponseSingleDtos as ServerThreadDto[]
    ).map(mapServerThread);

    return {
      threads,
      nextCursorMark: res.data.nextCursorMark ?? null,
    };
  } catch (err) {
    console.error('❌ [fetchMapThreads] 오류:', err);
    throw err;
  }
};
