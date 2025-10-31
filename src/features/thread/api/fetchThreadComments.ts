import { apiContents } from '@/services/apiService';
import { ThreadComment } from '../model/ThreadCommentModel';

/** ✅ 요청 파라미터 타입 */
export interface FetchThreadCommentsParams {
  threadId: string;
  currentMemberId: string;
  pagingState?: string | null;
}

/** ✅ 서버 응답 구조 */
export interface FetchThreadCommentsResponse {
  threadId: string;
  commentThreadResponseDtos: ThreadComment[];
  nextPagingState?: string | null;
}

/**
 * ✅ 댓글 목록 불러오기 API
 * - thread_id 기반 댓글 리스트 조회
 * - pagination 구조 포함
 */
export const fetchThreadComments = async ({
  threadId,
  currentMemberId,
  pagingState = null,
}: FetchThreadCommentsParams): Promise<FetchThreadCommentsResponse> => {
  console.log(
    '📤 [fetchThreadComments:REQUEST]',
    '\n threadId:',
    threadId,
    '\n currentMemberId:',
    currentMemberId,
    '\n pagingState:',
    pagingState ?? '(none)',
  );

  try {
    const response = await apiContents.get<FetchThreadCommentsResponse>(
      '/thread/readCommentThreadByThread',
      {
        params: {
          thread_id: threadId,
          current_member_id: currentMemberId,
          paging_state: pagingState ?? '',
        },
      },
    );

    const data = response.data;
    console.log(
      '✅ [fetchThreadComments:RESPONSE]',
      `\n threadId: ${data.threadId}`,
      `\n comments: ${data.commentThreadResponseDtos?.length ?? 0}`,
    );

    return data;
  } catch (error: any) {
    console.error(
      '❌ [fetchThreadComments:ERROR]',
      '\n message:',
      error?.message,
      '\n response:',
      error?.response?.data,
    );
    throw error;
  }
};
