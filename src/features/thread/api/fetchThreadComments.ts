import { apiContents } from '@/services/apiService';
import { ThreadComment } from '../model/ThreadCommentModel';

export interface FetchThreadCommentsParams {
  threadId: string;
  currentMemberId: string;
  pagingState?: string | null;
}

export interface FetchThreadCommentsResponse {
  threadId: string;
  commentThreadResponseDtos: ThreadComment[];
  nextPagingState?: string | null;
}

export const fetchThreadComments = async ({
  threadId,
  currentMemberId,
  pagingState = null,
}: FetchThreadCommentsParams): Promise<FetchThreadCommentsResponse> => {
  const response = await apiContents.get('/thread/readCommentThreadByThread', {
    params: {
      thread_id: threadId,
      current_member_id: currentMemberId,
      paging_state: pagingState,
    },
  });

  return response.data;
};
