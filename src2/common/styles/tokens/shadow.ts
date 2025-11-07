import { ViewStyle } from 'react-native';

export const SHADOW = {
  base: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 6,
  } as ViewStyle,
  soft: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  } as ViewStyle,
} as const;

export type ShadowPreset = keyof typeof SHADOW;
