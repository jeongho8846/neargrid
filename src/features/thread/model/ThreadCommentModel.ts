// src/features/thread/model/ThreadCommentModel.ts

/**
 * ✅ 앱 내부에서 사용하는 댓글 도메인 모델
 * - 서버 응답을 매핑하여 nullable 제거 및 기본값 처리
 * - UI 전용 상태 필드(isSkeleton, isOptimistic 등) 포함
 * - 대댓글 트리 구조를 지원하도록 확장
 */
export type ThreadComment = {
  /** 댓글 ID */
  commentThreadId: string;

  /** 댓글 내용 */
  description: string;

  /** 작성자 닉네임 */
  memberNickName: string;

  /** 작성자 프로필 이미지 */
  memberProfileImageUrl: string;

  /** 생성 시간 */
  createDatetime: string;

  // ✅ 서버 기반 필드
  threadId?: string;
  memberId?: string;
  parentCommentThreadId?: string | null;
  reactedByCurrentMember?: boolean;
  reactionCount?: number;

  /** 댓글 깊이 (0 = 일반 댓글, 1 = 대댓글) */
  depth?: number;

  /** 대댓글 총 개수 */
  childCommentThreadCount?: number;

  /** ✅ 미리 포함된 대댓글 (최대 3개까지 포함 가능) */
  initialChildCommentThreadResponseDtos?: ThreadComment[];

  // ✅ UI 전용 필드들
  /** 스켈레톤 상태 여부 (로딩 플레이스홀더용) */
  isSkeleton?: boolean;

  /** 낙관적 업데이트 여부 (서버 반영 전 로컬 상태) */
  isOptimistic?: boolean;

  /** 로컬에서 숨김 처리 여부 */
  isHiddenLocal?: boolean;
};
