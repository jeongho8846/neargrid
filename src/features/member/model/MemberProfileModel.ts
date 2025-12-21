import { MemberStats } from './MemberStatsModel';

export type MemberProfile = {
  /** 기본 정보 */
  id: string;
  nickname: string;
  realName?: string;
  description?: string;
  memberType?: string;

  /** 이미지 */
  profileImageUrl?: string;
  backgroundUrl?: string;

  /** 포인트 */
  receivedPoint: number;
  givenPoint: number;

  /** 통계 */
  stats: MemberStats;

  /** 기타 메타데이터 */
  followerCount?: number;
  followingCount?: number;
  originThreadCount?: number;
  commentThreadCount?: number;
  childThreadCount?: number;
  mentionedThreadCount?: number;
  editingThreadCount?: number;
  pinCount?: number;
  commentPinCount?: number;
  postCount?: number | null;
  commentPostCount?: number;
  chatBotCount?: number;
  createDateTime?: string;
  lastLoginDateTime?: string;

  /** 관계 정보 (현재 로그인 사용자 기준) */
  followedByCurrentMember?: boolean;
  followingCurrentMember?: boolean;
  blockedByCurrentMember?: boolean;
};
