export type MemberStats = {
  /** 🪙 도네이션 관련 */
  receivedPoint: number; // 받은 도네이션 포인트
  givenPoint: number; // 준 도네이션 포인트

  /** 👥 관계 관련 */
  followers: number; // 팔로워 수
  followings: number; // 팔로잉 수
  chatBots: number; // 챗봇 수

  /** 🧵 활동 관련 */
  threads: number; // 작성한 쓰레드 수
  comments: number; // 작성한 댓글 수
  mentions: number; // 멘션된 횟수
};
