import { AuthResponseDto, Member } from './types';

export const toMember = (dto: AuthResponseDto): Member => ({
  id: dto.memberId ?? dto.member_id,
  realName: dto.realName,
  nickname: dto.nickName,
  role: dto.roleType,
  lastUsedDistance: dto.lastUsedDistanceForThreadFeed
    ? parseInt(dto.lastUsedDistanceForThreadFeed, 10)
    : undefined,
  profileImageUrl: dto.profileImageUrl ?? undefined,
});
