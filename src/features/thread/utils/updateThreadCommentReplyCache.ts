// 📄 src/features/thread/utils/updateThreadCommentReplyCache.ts
import { QueryClient } from '@tanstack/react-query';
import { ThreadComment } from '../model/ThreadCommentModel';

/**
 * ✅ 부모 댓글 DTO의 childCommentThreadResponseDtos 갱신 유틸
 * - parentCommentThreadId 일치 항목을 찾아서
 *   - childCommentThreadCount +1
 *   - initialChildCommentThreadResponseDtos 3개 미만이면 새 reply 추가
 * - 테스트용 상세 로그 추가
 */
export function updateThreadCommentReplyCache(
  queryClient: QueryClient,
  threadId: string,
  parentCommentThreadId: string,
  newReply: ThreadComment,
) {
  const key = ['commentThreads', threadId];
  const prev = queryClient.getQueryData<ThreadComment[]>(key);

  console.log('🧠 [updateThreadCommentReplyCache] 호출됨');
  console.log('   ├─ threadId:', threadId);
  console.log('   ├─ parentCommentThreadId:', parentCommentThreadId);
  console.log('   ├─ newReply.id:', newReply.commentThreadId);
  console.log('   ├─ 캐시 키:', key);
  console.log('   ├─ 캐시 존재 여부:', !!prev);

  if (!prev) {
    console.log('⚠️ [updateThreadCommentReplyCache] ❌ 캐시 없음:', key);
    return;
  }

  const updated = prev.map(comment => {
    if (comment.commentThreadId !== parentCommentThreadId) return comment;

    const replies = comment.initialChildCommentThreadResponseDtos ?? [];
    const shouldAdd = replies.length < 3;

    console.log('🧩 [updateThreadCommentReplyCache] 부모 댓글 발견');
    console.log('   ├─ 기존 replies:', replies.length);
    console.log('   ├─ childCount:', comment.childCommentThreadCount);
    console.log('   ├─ shouldAdd:', shouldAdd);

    // ✅ 중복 방지 + 3개 제한 내 추가
    const newReplies = shouldAdd
      ? [
          newReply,
          ...replies.filter(
            r => r.commentThreadId !== newReply.commentThreadId,
          ),
        ]
      : replies;

    console.log(
      '   ├─ 새로운 replies.length:',
      newReplies.length,
      shouldAdd ? '(추가됨)' : '(유지됨)',
    );

    const result = {
      ...comment,
      childCommentThreadCount:
        (comment.childCommentThreadCount ?? replies.length) + 1,
      initialChildCommentThreadResponseDtos: newReplies,
    };

    console.log('   └─ ✅ 업데이트 완료 →', {
      id: result.commentThreadId,
      childCount: result.childCommentThreadCount,
      replies: result.initialChildCommentThreadResponseDtos?.length,
    });

    return result;
  });

  queryClient.setQueryData(key, updated);

  console.log('✅ [updateThreadCommentReplyCache] 최종 캐시 업데이트 완료');
  console.log('   └─ 최종 캐시:', JSON.stringify(updated, null, 2));
}
