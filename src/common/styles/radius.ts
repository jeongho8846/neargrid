export const RADIUS = {
  sm: 8,
  md: 12,
  lg: 18,
  xl: 24,
  round: 999,
} as const;

export type RadiusToken = keyof typeof RADIUS;
