import { apiContents } from '@/services/apiService';

type CommentThreadReactionParams = {
  threadId: string;
  commentThreadId: string;
  currentMemberId: string;
  nextLiked: boolean; // true: create, false: delete
};

export async function updateCommentThreadReaction({
  threadId,
  commentThreadId,
  currentMemberId,
  nextLiked,
}: CommentThreadReactionParams) {
  if (!currentMemberId) {
    throw new Error('AUTH_REQUIRED');
  }

  const formData = new FormData();
  formData.append('thread_id', threadId);
  formData.append('comment_thread_id', commentThreadId);
  formData.append('current_member_id', currentMemberId);
  formData.append('rating', '1');

  const url = nextLiked
    ? '/commentThread/createCommentThreadReaction'
    : '/commentThread/deleteCommentThreadReaction';

  const headers = { 'Content-Type': 'multipart/form-data' as const };

  if (nextLiked) {
    await apiContents.post(url, formData, { headers });
  } else {
    await apiContents.delete(url, { data: formData, headers });
  }
}
