import { useMutation } from '@tanstack/react-query';
import { createThreadComment } from '../api/createThreadComment';

/**
 * ✅ 서버 요청 전용 댓글 생성 훅
 * - 캐시 업데이트는 Optimistic 훅(useCreateThreadCommentWithOptimistic)에서 처리
 * - 여기서는 오직 서버 Mutation만 담당
 */
export const useCreateThreadComment = () => {
  return useMutation({
    mutationFn: createThreadComment,
  });
};
