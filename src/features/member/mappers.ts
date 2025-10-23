import { AuthResponseDto, Member } from './types';

// ✅ Partial로 수정 — 토큰 없이도 안전하게 동작
export const toMember = (dto: Partial<AuthResponseDto>): Member => ({
  id: dto.memberId ?? dto.member_id ?? '',
  realName: dto.realName,
  nickname: dto.nickName ?? '',
  role: dto.roleType,
  lastUsedDistance: dto.lastUsedDistanceForThreadFeed
    ? parseInt(dto.lastUsedDistanceForThreadFeed, 10)
    : undefined,
  profileImageUrl: dto.profileImageUrl ?? undefined,
});
