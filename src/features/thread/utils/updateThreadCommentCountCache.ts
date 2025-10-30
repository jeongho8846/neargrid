// src/features/thread/utils/updateThreadCommentCountCache.ts
/**
 * ✅ 댓글 수 갱신 유틸 (쿼리 구조 제거 버전)
 * - React Query 캐시 조작 제거
 * - 필요 시 상위 컴포넌트에서 직접 상태 갱신하도록 변경
 */
export const updateThreadCommentCountCache = (_threadId: string) => {
  // React Query 제거 버전에서는 캐시를 직접 수정하지 않음.
  // 대신 필요 시 상위 상태나 리스트 ref에서 직접 처리하세요.
  console.log(
    'ℹ️ [updateThreadCommentCountCache] 캐시 업데이트 로직 제거됨 (쿼리 비활성화 상태)',
  );
};
