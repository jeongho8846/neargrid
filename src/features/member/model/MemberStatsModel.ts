export type MemberStats = {
  /** 🪙 도네이션 관련 */
  receivedPoint: number; // 받은 도네이션 포인트
  givenPoint: number; // 준 도네이션 포인트

  /** 👥 관계 관련 */
  followers: number; // 팔로워 수
  followings: number; // 팔로잉 수
  chatBots: number; // 챗봇 수

  /** 🧵 활동 관련 */
  threads: number; // 작성한 원본 쓰레드 수
  childThreads: number; // 작성한 자식 쓰레드 수
  comments: number; // 작성한 댓글/답글 수
  mentions: number; // 멘션된 횟수
  editingThreads: number; // 편집 중인 쓰레드 수

  /** 📌 기타 */
  pins: number; // 핀 개수
  commentPins: number; // 핀 댓글 개수
  posts: number | null; // 포스트 개수 (nullable)
  commentPosts: number; // 포스트 댓글 개수
};
