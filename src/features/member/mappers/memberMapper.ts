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
    childThreadCount?: number;
    mentionedThreadCount?: number;
    editingThreadCount?: number;
    pinCount?: number;
    commentPinCount?: number;
    postCount?: number | null;
    commentPostCount?: number;
    chatBotCount?: number;
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
    chatBots: m.chatBotCount ?? 0,
    threads: m.originThreadCount ?? 0,
    childThreads: m.childThreadCount ?? 0,
    comments: m.commentThreadCount ?? 0,
    mentions: m.mentionedThreadCount ?? 0,
    editingThreads: m.editingThreadCount ?? 0,
    pins: m.pinCount ?? 0,
    commentPins: m.commentPinCount ?? 0,
    posts: m.postCount ?? null,
    commentPosts: m.commentPostCount ?? 0,
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
    childThreadCount: m.childThreadCount,
    mentionedThreadCount: m.mentionedThreadCount,
    editingThreadCount: m.editingThreadCount,
    pinCount: m.pinCount,
    commentPinCount: m.commentPinCount,
    postCount: m.postCount,
    commentPostCount: m.commentPostCount,
    chatBotCount: m.chatBotCount,
    createDateTime: m.createDateTime,
    lastLoginDateTime: m.lastLoginDateTime,

    /** 관계 정보 */
    followedByCurrentMember: dto.followedByCurrentMember,
    followingCurrentMember: dto.followingCurrentMember,
    blockedByCurrentMember: dto.blockedByCurrentMember,
  };
};
