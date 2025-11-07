import { ViewStyle } from 'react-native';
import { SHADOW } from '../tokens';

export const ELEVATION = {
  soft: SHADOW.soft as ViewStyle,
  base: SHADOW.base as ViewStyle,
} as const;
