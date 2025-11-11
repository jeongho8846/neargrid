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
    memberType?: string;
    createDateTime?: string;
    lastLoginDateTime?: string;
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
    /** 기본 정보 */
    id: m.id,
    nickname: m.nickName,
    realName: m.realName, // ✅ 추가됨
    description: m.profileText,
    memberType: m.memberType,

    /** 이미지 */
    profileImageUrl: m.profileImageUrl,
    backgroundUrl: m.coverImageUrl,

    /** 포인트 */
    receivedPoint: m.donationPointReceivedCount ?? 0,
    givenPoint: m.donationPointGivenCount ?? 0,

    /** 통계 */
    stats,

    /** 메타데이터 */
    followerCount: m.followerCount,
    followingCount: m.followingCount,
    originThreadCount: m.originThreadCount,
    commentThreadCount: m.commentThreadCount,
    createDateTime: m.createDateTime,
    lastLoginDateTime: m.lastLoginDateTime,

    /** 관계 정보 */
    followedByCurrentMember: dto.followedByCurrentMember,
    followingCurrentMember: dto.followingCurrentMember,
    blockedByCurrentMember: dto.blockedByCurrentMember,
  };
};
