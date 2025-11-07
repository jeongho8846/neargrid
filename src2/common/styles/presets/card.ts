import { ViewStyle } from 'react-native';
import { COLORS, RADIUS, SPACING, SHADOW } from '../tokens';

export const CARD = {
  /* ──────────────── 기본 카드 ──────────────── */
  base: {
    backgroundColor: COLORS.surface_light,
    borderWidth: 0.5,
    borderColor: COLORS.border_light,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    ...SHADOW.soft, // ✅ 은은한 그림자
  } as ViewStyle,

  /* ──────────────── 강조 카드 ──────────────── */
  elevated: {
    backgroundColor: COLORS.surface_light,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    ...SHADOW.base, // ✅ 강한 그림자
  } as ViewStyle,

  /* ──────────────── 평면 카드 ──────────────── */
  flat: {
    backgroundColor: COLORS.surface,
    borderWidth: 0.5,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    shadowColor: 'transparent', // ✅ 그림자 없음
  } as ViewStyle,

  /* ──────────────── 투명 카드 (overlay용) ──────────────── */
  transparent: {
    backgroundColor: 'rgba(255,255,255,0.05)', // ✅ 살짝 밝은 반투명
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 0.5,
    borderColor: COLORS.border_light,
  } as ViewStyle,

  /* ──────────────── 강조 색상 카드 ──────────────── */
  primary: {
    backgroundColor: COLORS.primary_dark,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.primary_light,
    ...SHADOW.base,
  } as ViewStyle,
} as const;
