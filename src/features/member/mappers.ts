import { SignInResponseDto, Member } from './types';

// DTO → Domain 변환
export const toMember = (dto: SignInResponseDto): Member => ({
  id: dto.memberId ?? dto.member_id, // 서버가 두 가지 필드 내려주므로 fallback 처리
  nickname: dto.nickName,
  realName: dto.realName,
  role: dto.roleType,
  lastUsedDistance: parseInt(dto.lastUsedDistanceForThreadFeed, 10),
  profileImageUrl: dto.profileImageUrl ?? undefined,
});
