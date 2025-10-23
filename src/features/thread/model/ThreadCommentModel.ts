export type ThreadComment = {
  commentThreadId: string;
  threadId: string;
  memberId: string;
  memberNickName: string;
  memberProfileImageUrl?: string | null;
  description: string; // 댓글 내용
  reactionCount: number; // 좋아요 수
  reactedByCurrentMember: boolean; // 내가 좋아요 눌렀는지
  createDateTime: string;
  updateDateTime: string;
  depth: number;
  parentCommentThreadId: string;
  childCommentThreadCount: number;
  imageUrl?: string | null;
  hiddenDueToReport?: boolean;
  distanceFromCurrentMember?: number;
};
