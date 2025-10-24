// src/features/thread/api/createThreadComment.ts
import { apiContents } from '@/services/apiService';

type CreateThreadCommentParams = {
  threadId: string;
  text: string;
  currentMemberId?: string;
};

export async function createThreadComment({
  threadId,
  text,
  currentMemberId,
}: CreateThreadCommentParams) {
  const formData = new FormData();
  formData.append('thread_id', threadId);
  formData.append('comment_text', text);
  if (currentMemberId) formData.append('current_member_id', currentMemberId);

  const res = await apiContents.post(
    '/commentThread/createCommentThread',
    formData,
    {
      headers: { 'Content-Type': 'multipart/form-data' },
    },
  );

  return res.data;
}
