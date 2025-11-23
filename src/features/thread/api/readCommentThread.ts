import { apiContents } from '@/services/apiService';
import { ThreadComment } from '../model/ThreadCommentModel';

/**
 * ✅ 단일 댓글 상세 조회 API
 * - commentThreadId로 특정 댓글의 정보를 가져옴
 * - commentId만으로 진입하는 경우 댓글 정보를 구성하기 위해 사용
 */
export const readCommentThread = async (
  commentThreadId: string,
  threadId: string,
  memberId?: string,
): Promise<ThreadComment | null> => {
  console.log('📡 [readCommentThread] Request:', {
    commentThreadId,
    threadId,
    memberId,
  });

  try {
    const response = await apiContents.get('/commentThread/readCommentThread', {
      params: {
        comment_thread_id: commentThreadId,
        thread_id: threadId,
        current_member_id: memberId ?? '',
      },
    });

    const commentData = response.data;

    console.log('✅ [readCommentThread] Response:', {
      status: response.status,
      commentThreadId: commentData.commentThreadId,
      comment: commentData,
    });

    return commentData as ThreadComment;
  } catch (error: any) {
    console.error('❌ [readCommentThread] Error:', {
      message: error?.message,
      response: error?.response?.data,
      status: error?.response?.status,
      commentThreadId,
    });

    return null;
  }
};
