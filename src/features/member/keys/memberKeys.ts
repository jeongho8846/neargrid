export const MEMBER_KEYS = {
  all: ['member'] as const,
  profile: (memberId: string) =>
    [...MEMBER_KEYS.all, 'profile', memberId] as const,
};
