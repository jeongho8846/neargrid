import { ViewStyle, TextStyle } from 'react-native';
import { COLORS, SPACING, RADIUS } from '../tokens';

export const BADGE = {
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: RADIUS.round,
    backgroundColor: COLORS.badge,
  } as ViewStyle,

  text: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.text_primary,
  } as TextStyle,

  /* ─────────────── Variants ─────────────── */
  secondary: {
    backgroundColor: COLORS.secondary,
  } as ViewStyle,

  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: COLORS.text_secondary,
  } as ViewStyle,
} as const;
