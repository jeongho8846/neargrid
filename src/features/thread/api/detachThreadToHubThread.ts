import { apiContents } from '@/services/apiService';

type DetachPayload = {
  currentMemberId: string;
  hubThreadId: string;
  threadId: string;
};

/**
 * ✅ POST /thread/detachThreadToHubThread
 * - 허브 스레드에 붙어있는 자식 스레드 분리
 */
export const detachThreadToHubThread = async ({
  currentMemberId,
  hubThreadId,
  threadId,
}: DetachPayload) => {
  const formData = new FormData();
  formData.append('current_member_id', currentMemberId);
  formData.append('hub_thread_id', hubThreadId);
  formData.append('thread_id', threadId);

  return apiContents.post('/thread/detachThreadToHubThread', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};
