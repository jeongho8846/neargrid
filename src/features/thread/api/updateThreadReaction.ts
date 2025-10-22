import { apiContents } from '@/services/apiService';

type Params = {
  threadId: string;
  currentMemberId: string; // ← 외부에서 주입
  nextLiked: boolean; // true: 생성, false: 삭제
};

export async function updateThreadReaction({
  threadId,
  currentMemberId,
  nextLiked,
}: Params) {
  if (!currentMemberId) {
    throw new Error('AUTH_REQUIRED');
  }

  const formData = new FormData();
  formData.append('thread_id', threadId);
  formData.append('current_member_id', currentMemberId);
  formData.append('rating', '1');

  const url = nextLiked
    ? '/thread/createThreadReaction'
    : '/thread/deleteThreadReaction';

  const headers = { 'Content-Type': 'multipart/form-data' as const };

  if (nextLiked) {
    await apiContents.post(url, formData, { headers });
  } else {
    await apiContents.delete(url, { data: formData, headers });
  }
}
