import { apiContents } from '@/services/apiService';
import { ThreadComment } from '../model/ThreadCommentModel';

/** ✅ 요청 파라미터 타입 */
export interface FetchChildCommentThreadsParams {
  threadId: string;
  commentThreadId: string;
  currentMemberId: string;
  pagingState?: string;
}

/** ✅ 서버 응답 구조 */
interface ServerResponse {
  parentCommentThreadId: string;
  childCommentThreadResponseDtos: ThreadComment[];
  nextPagingState?: string | null;
}

/** ✅ 대댓글 불러오기 API */
export const fetchChildCommentThreads = async ({
  threadId,
  commentThreadId,
  currentMemberId,
  pagingState,
}: FetchChildCommentThreadsParams) => {
  console.log(
    '📤 [fetchChildCommentThreads:REQUEST]',
    '\n currentMemberId:',
    currentMemberId,
    '\n threadId:',
    threadId,
    '\n commentThreadId:',
    commentThreadId,
    '\n pagingState:',
    pagingState ?? '(none)',
  );

  try {
    const response = await apiContents.get<ServerResponse>(
      '/commentThread/readChildCommentThreadByCommentThread',
      {
        params: {
          current_member_id: currentMemberId,
          thread_id: threadId,
          comment_thread_id: commentThreadId,
          paging_state: pagingState ?? '',
        },
      },
    );

    const res = response.data;

    console.log(
      '✅ [fetchChildCommentThreads:RESPONSE]',
      '\n nextPagingState:',
      res.nextPagingState,
      '\n count:',
      res.childCommentThreadResponseDtos?.length ?? 0,
    );

    // ✅ React Query에서 flatMap할 수 있도록 일관된 구조로 리턴
    return {
      childCommentThreadResponseDtos: res.childCommentThreadResponseDtos ?? [],
      nextPagingState: res.nextPagingState ?? null,
    };
  } catch (error: any) {
    console.error(
      '❌ [fetchChildCommentThreads:ERROR]',
      '\n message:',
      error?.message,
      '\n response:',
      error?.response?.data,
    );
    throw error;
  }
};
