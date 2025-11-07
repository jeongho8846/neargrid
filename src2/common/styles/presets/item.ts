import { ViewStyle } from 'react-native';
import { SPACING } from '../tokens';

export const ITEM = {
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
  } as ViewStyle,

  column: {
    flexDirection: 'column',
    gap: SPACING.xs,
  } as ViewStyle,
} as const;
