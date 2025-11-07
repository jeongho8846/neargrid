import { ViewStyle } from 'react-native';
import { COLORS, RADIUS, SPACING } from '../tokens';

export const SKELETON = {
  base: {
    backgroundColor: COLORS.surface_light,
    borderRadius: RADIUS.sm,
  } as ViewStyle,

  text: {
    backgroundColor: COLORS.surface_light,
    height: 14,
    borderRadius: RADIUS.sm,
    marginBottom: SPACING.xs,
  } as ViewStyle,

  box: {
    backgroundColor: COLORS.surface_light,
    height: 300,
    borderRadius: RADIUS.sm,
    marginBottom: SPACING.xs,
  } as ViewStyle,
} as const;
