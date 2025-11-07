import { ViewStyle } from 'react-native';
import { COLORS, RADIUS, SPACING } from '../tokens';

export const BOTTOM_SHEET = {
  container: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
    padding: SPACING.lg,
  } as ViewStyle,

  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.border_light,
    alignSelf: 'center',
    marginBottom: SPACING.sm,
  } as ViewStyle,
} as const;
