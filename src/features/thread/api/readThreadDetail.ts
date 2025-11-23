// 📄 src/features/thread/api/readThreadDetail.ts
import { apiContents } from '@/services/apiService';
import { ServerThreadDto, mapServerThread, Thread } from '../model/ThreadModel';

/** ✅ 요청 파라미터 타입 */
export interface ReadThreadDetailParams {
  threadId: string;
  readThreadType: 'CHILD_THREAD';
  currentMemberId: string;
  pagingState?: string | null;
}

/** ✅ 서버 응답 구조 */
export interface ReadThreadDetailResponse {
  currentMemberId: string;
  threadResponseDtoList: ServerThreadDto[];
  nextPagingState?: string | null;
}

/**
 * ✅ ROUTE_THREAD의 자식 스레드 목록 불러오기 API
 * - thread_id: 부모 ROUTE_THREAD의 ID
 * - read_thread_type: CHILD_THREAD (고정값)
 * - pagination 구조 포함
 */
export const readThreadDetail = async ({
  threadId,
  readThreadType,
  currentMemberId,
  pagingState = null,
}: ReadThreadDetailParams): Promise<Thread[]> => {
  console.log('='.repeat(60));
  console.log('📤 [readThreadDetail:REQUEST]');
  console.log('='.repeat(60));
  console.log('threadId:', threadId);
  console.log('readThreadType:', readThreadType);
  console.log('currentMemberId:', currentMemberId);
  console.log('pagingState:', pagingState ?? '(none)');
  console.log('='.repeat(60));

  try {
    const response = await apiContents.get<ReadThreadDetailResponse>(
      '/thread/readThreadDetail',
      {
        params: {
          thread_id: threadId,
          read_thread_type: readThreadType,
          current_member_id: currentMemberId,
          paging_state: pagingState ?? '',
        },
      },
    );

    const data = response.data;

    console.log('='.repeat(60));
    console.log('✅ [readThreadDetail:RESPONSE]');
    console.log('='.repeat(60));
    console.log('threadId:', threadId);
    console.log('childThreads count:', data.threadResponseDtoList?.length ?? 0);
    console.log('nextPagingState:', data.nextPagingState ?? '(none)');
    console.log('Raw response:', JSON.stringify(data, null, 2));
    console.log('='.repeat(60));

    // ✅ ServerThreadDto → Thread 변환
    const threads = (data.threadResponseDtoList ?? []).map(mapServerThread);

    console.log('🔄 [readThreadDetail:MAPPED]');
    console.log('Mapped threads count:', threads.length);
    threads.forEach((thread, index) => {
      console.log(
        `  [${index}] ${thread.threadId} - ${
          thread.threadType
        } - ${thread.description?.substring(0, 30)}...`,
      );
    });
    console.log('='.repeat(60));

    return threads;
  } catch (error: any) {
    console.log('='.repeat(60));
    console.error('❌ [readThreadDetail:ERROR]');
    console.log('='.repeat(60));
    console.error('message:', error?.message);
    console.error('status:', error?.response?.status);
    console.error('statusText:', error?.response?.statusText);
    console.error(
      'response data:',
      JSON.stringify(error?.response?.data, null, 2),
    );
    console.error('full error:', error);
    console.log('='.repeat(60));
    throw error;
  }
};
