/**
 * 🗝️ Thread 관련 React Query 키 정의 (단순화 버전)
 * - Thread 단위 캐싱만 유지
 * - 리스트는 threadIds 배열만 관리
 */

export const THREAD_KEYS = {
  // ✅ 모든 Thread 캐시의 루트 prefix
  all: ['threads'] as const,

  // ✅ 피드 리스트 (단순히 threadIds 배열 캐싱용)
  list: () => [...THREAD_KEYS.all, 'list'] as const,

  // ✅ 단일 Thread 캐시
  detail: (threadId: string) =>
    [...THREAD_KEYS.all, 'detail', threadId] as const,
};
