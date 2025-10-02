// ✅ 로그인 & 리프레시 공통 응답 DTO
export type AuthResponseDto = {
  member_id: string; // snake_case
  memberId: string; // camelCase (중복으로 오는 경우 있음)
  realName?: string;
  nickName: string;
  profileImageUrl?: string | null;
  roleType?: string; // 로그인에는 있지만 refresh에서는 없을 수도 있음
  lastUsedDistanceForThreadFeed?: string;
  accessToken: string;
  refreshToken: string;
};

// ✅ 앱에서 사용하는 정규화된 Member 모델
export type Member = {
  id: string;
  realName?: string;
  nickname: string;
  role?: string;
  lastUsedDistance?: number;
  profileImageUrl?: string;
};
