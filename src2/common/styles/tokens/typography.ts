import { TextStyle } from 'react-native';
import { COLORS } from './colors';

export const FONT = {
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text_primary,
    lineHeight: 19,
  } as TextStyle,
  body: {
    fontSize: 14,
    fontWeight: '400',
    color: COLORS.text_primary,
    lineHeight: 15,
  } as TextStyle,
  caption: {
    fontSize: 12,
    fontWeight: '400',
    color: COLORS.text_secondary,
    lineHeight: 13,
  } as TextStyle,
  button: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.text_primary,
    lineHeight: 16,
  } as TextStyle,
  label: {
    fontSize: 13,
    fontWeight: '500',
    color: COLORS.text_secondary,
    lineHeight: 14,
  } as TextStyle,
} as const;

export type FontVariant = keyof typeof FONT;
