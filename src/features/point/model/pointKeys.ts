// src/features/point/keys/pointKeys.ts
export const POINT_KEYS = {
  all: ['point'] as const,
  memberPoint: (memberId: string) =>
    [...POINT_KEYS.all, 'memberPoint', memberId] as const,
};
