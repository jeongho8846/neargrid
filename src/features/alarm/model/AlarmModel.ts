export type AlarmModel = {
  alarmId: string;
  alarmType:
    | 'POST'
    | 'THREAD_REPLY'
    | 'COMMENT_THREAD'
    | 'CHILD_COMMENT_THREAD'
    | 'COMMENT_POST'
    | 'CHILD_COMMENT_POST'
    | 'THREAD_REACTION'
    | 'PIN_REACTION'
    | 'POST_LIKE'
    | 'POST_DISLIKE'
    | 'PIN_VIEW'
    | 'NEW_FOLLOWER'
    | 'COMMENT_THREAD_REACTION'
    | string;
  viewedByMember: boolean;

  receiveMemberId?: string;
  sendMemberId?: string; // ✅ 추가
  sendMemberNickName?: string;
  sendMemberProfileImageUrl?: string;

  parentParentTargetId?: string | null; // ✅ 추가
  parentTargetId?: string | null; // ✅ 추가
  parentTargetDescription?: string | null; // ✅ 추가
  parentTargetImageUrl?: string | null; // ✅ 추가
  parentTargetSubject?: string | null; // ✅ 추가

  targetId?: string | null;
  targetDescription?: string | null;
  targetImageUrl?: string | null;
  targetSubject?: string | null; // ✅ 추가

  createDateTime?: string;
};
