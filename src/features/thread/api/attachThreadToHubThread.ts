import { apiContents } from '@/services/apiService';

type AttachPayload = {
  currentMemberId: string;
  hubThreadId: string;
  threadIds: string[];
};

/**
 * ✅ POST /thread/attachThreadToHubThread
 * - 허브 스레드에 내 스레드를 붙이기
 */
export const attachThreadToHubThread = async ({
  currentMemberId,
  hubThreadId,
  threadIds,
}: AttachPayload) => {
  const formData = new FormData();
  formData.append('current_member_id', currentMemberId);
  formData.append('hub_thread_id', hubThreadId);
  // 서버 요구사항: 콤마로 연결된 id 문자열 (예: id1,id2,id3)
  formData.append('thread_ids', threadIds.join(','));

  return apiContents.post('/thread/attachThreadToHubThread', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};
