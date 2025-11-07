import { ViewStyle } from 'react-native';
import { SPACING, COLORS } from '../tokens';

export const LIST = {
  container: {
    paddingVertical: SPACING.sm,
  } as ViewStyle,

  item: {
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.border,
    paddingVertical: SPACING.md,
  } as ViewStyle,

  divider: {
    height: 0.5,
    backgroundColor: COLORS.border_light,
    opacity: 0.3,
  } as ViewStyle,
} as const;
