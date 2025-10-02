// ✅ 서버에서 내려주는 원본 DTO (signIn 응답)
export type SignInResponseDto = {
  member_id: string; // snake_case
  memberId: string; // camelCase (중복 필드 주의!)
  realName: string;
  nickName: string;
  roleType: 'USER' | 'ADMIN' | string; // 역할
  lastUsedDistanceForThreadFeed: string; // 숫자지만 문자열로 옴
  profileImageUrl: string | null;
  accessToken: string;
  refreshToken: string;
};

// ✅ 클라이언트에서 사용할 도메인 모델
export type Member = {
  id: string;
  nickname: string;
  realName: string;
  role: string;
  lastUsedDistance: number; // 숫자로 변환
  profileImageUrl?: string;
};
