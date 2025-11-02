import { MemberProfile } from '../model/MemberProfileModel';
import { MemberStats } from '../model/MemberStatsModel';

/** 🔹 서버 DTO 타입 */
export type MemberProfileResponse = {
  member: {
    id: string;
    nickName: string;
    realName?: string;
    profileText?: string;
    profileImageUrl?: string;
    coverImageUrl?: string;
    donationPointGivenCount?: number;
    donationPointReceivedCount?: number;
    followerCount?: number;
    followingCount?: number;
    originThreadCount?: number;
    commentThreadCount?: number;
  };
  chatBot: any;
  followedByCurrentMember: boolean;
  followingCurrentMember: boolean;
  blockedByCurrentMember: boolean;
};

/** ✅ DTO → Domain Model 변환기 */
export const mapMemberProfileDto = (
  dto: MemberProfileResponse,
): MemberProfile => {
  const m = dto.member ?? {};

  const stats: MemberStats = {
    followers: m.followerCount ?? 0,
    followings: m.followingCount ?? 0,
    threads: m.originThreadCount ?? 0,
    comments: m.commentThreadCount ?? 0,
  };

  return {
    id: m.id,
    nickname: m.nickName,
    description: m.profileText,
    profileImageUrl: m.profileImageUrl,
    backgroundUrl: m.coverImageUrl,
    receivedPoint: m.donationPointReceivedCount ?? 0,
    givenPoint: m.donationPointGivenCount ?? 0,
    stats,
  };
};
