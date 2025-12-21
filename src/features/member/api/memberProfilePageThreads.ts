import { apiContents } from '@/services/apiService';

type MemberProfilePageThreadsParams = {
  currentMemberId: string; // 조회자 (viewer)
  targetMemberId: string; // 대상 프로필 사용자
  pagingState?: string | null;
  pageThreadType?: PageThreadType;
};

export type PageThreadType = 'THREAD' | 'MENTIONED_THREAD' | 'EDITING_THREAD';

export type MemberProfilePageThreadsResponse = {
  threadResponseDtoList?: any[];
  paging_state?: string | null;
  nextPagingState?: string | null;
  [key: string]: any;
};

/**
 * ✅ GET /page/memberProfilePageThreads
 * - 대상 사용자의 스레드 목록을 페이지네이션으로 조회
 */
export const memberProfilePageThreads = async ({
  currentMemberId,
  targetMemberId,
  pagingState,
  pageThreadType = 'THREAD',
}: MemberProfilePageThreadsParams): Promise<MemberProfilePageThreadsResponse> => {
  const endpoint = '/page/memberProfilePageThreads';
  const params: Record<string, any> = {
    current_member_id: currentMemberId,
    member_id: targetMemberId,
    page_thread_type: pageThreadType,
  };

  if (pagingState) {
    params.paging_state = pagingState;
  }

  console.log('🌐 [memberProfilePageThreads] 요청', params);

  try {
    const res = await apiContents.get(endpoint, { params });
    console.log('✅ [memberProfilePageThreads] 응답', res.data);
    return res.data as MemberProfilePageThreadsResponse;
  } catch (err: any) {
    console.error('❌ [memberProfilePageThreads] 오류', err?.response?.data || err);
    throw err;
  }
};
