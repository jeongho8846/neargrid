import { apiContents } from '@/services/apiService';
import { ServerThreadDto, Thread } from '../model/ThreadModel';
import { mapServerThread } from '../mappers/threadMapper';

/**
 * ✅ 단일 쓰레드 상세 조회 API
 * - threadId로 특정 쓰레드의 정보를 가져옴
 * - threadId만으로 진입하는 경우 헤더 정보를 구성하기 위해 사용
 */
export const readThread = async (
  threadId: string,
  memberId?: string,
): Promise<Thread | null> => {
  console.log('📡 [readThread] Request:', {
    threadId,
    memberId,
  });

  try {
    const response = await apiContents.get('/thread/readThread', {
      params: {
        thread_id: threadId,
        Blankable_current_member_id: memberId ?? '',
      },
    });

    const dto = response.data as ServerThreadDto;
    const thread = mapServerThread(dto);

    console.log('✅ [readThread] Response:', {
      status: response.status,
      threadId: thread.threadId,
      thread,
    });

    return thread;
  } catch (error: any) {
    console.error('❌ [readThread] Error:', {
      message: error?.message,
      response: error?.response?.data,
      status: error?.response?.status,
      threadId,
    });

    return null;
  }
};
