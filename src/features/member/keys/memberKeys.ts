export const MEMBER_KEYS = {
  all: ['member'] as const,

  // 🔹 프로필
  profile: (memberId: string) =>
    [...MEMBER_KEYS.all, 'profile', memberId] as const,

  // 🔹 차단 목록
  blockedList: (memberId: string) =>
    [...MEMBER_KEYS.all, 'blockedList', memberId] as const,
};
