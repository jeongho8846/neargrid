import { ViewStyle, StyleSheet } from 'react-native';
import { COLORS } from '../tokens';

export const OVERLAY = {
  dark: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: COLORS.overlay_dark,
  } as ViewStyle,

  light: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: COLORS.overlay_light,
  } as ViewStyle,
} as const;
